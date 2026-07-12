import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import {
  createAdminRole,
  getAdminDatabaseTables,
  updateAdminRole,
  type AdminRole,
  type RolePolicyCatalog,
} from "../services/adminDashboardService";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";

interface Props {
  isOpen: boolean;
  role: AdminRole | null;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

const EMPTY_CATALOG: RolePolicyCatalog = {
  tables: [],
  systemCapabilities: [],
  basePolicies: {},
  baseSystemCapabilities: {},
};

export default function CreateRoleModal({ isOpen, role, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [tablePrivileges, setTablePrivileges] = useState<Record<string, string[]>>({});
  const [systemCapabilities, setSystemCapabilities] = useState<string[]>([]);
  const [grantOption, setGrantOption] = useState(false);
  const [catalog, setCatalog] = useState<RolePolicyCatalog>(EMPTY_CATALOG);
  const [query, setQuery] = useState("");
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setName(role?.name ?? "");
    setTablePrivileges(role?.tablePrivileges ?? {});
    setSystemCapabilities(role?.systemCapabilities ?? []);
    setGrantOption(role?.grantOption ?? false);
    setQuery("");
    setFieldErrors({});
    setFormError("");

    setLoadingCatalog(true);
    getAdminDatabaseTables()
      .then(setCatalog)
      .catch(() => toast.error("Could not load privilege options."))
      .finally(() => setLoadingCatalog(false));
  }, [isOpen, role]);

  const allowedPolicy = useMemo(
    () => {
      if (role?.isSystem && role.baseScope) {
        return catalog?.basePolicies?.[role.baseScope] ?? {};
      }
      return Object.fromEntries((catalog?.tables ?? []).map((table) => [table.name, table.actions]));
    },
    [catalog, role]
  );
  const visibleTables = useMemo(() => {
    const search = query.trim().toLowerCase();
    return (catalog?.tables ?? []).filter((table) => {
      const allowed = allowedPolicy[table.name] ?? [];
      return allowed.length > 0 && (!search || table.name.toLowerCase().includes(search));
    });
  }, [catalog, allowedPolicy, query]);

  const availableCapabilities = role?.isSystem && role.baseScope
    ? catalog?.baseSystemCapabilities?.[role.baseScope] ?? []
    : [];

  function togglePrivilege(table: string, action: string) {
    setTablePrivileges((current) => {
      const selected = current[table] ?? [];
      const nextActions = selected.includes(action)
        ? selected.filter((value) => value !== action)
        : [...selected, action];
      const next = { ...current };
      if (nextActions.length > 0) next[table] = nextActions;
      else delete next[table];
      return next;
    });
  }

  function selectAll(table: string) {
    setTablePrivileges((current) => ({ ...current, [table]: [...(allowedPolicy[table] ?? [])] }));
  }

  function clearTable(table: string) {
    setTablePrivileges((current) => {
      const next = { ...current };
      delete next[table];
      return next;
    });
  }

  async function handleSave() {
    const trimmedName = name.trim();
    const errors: Record<string, string> = {};
    if (!trimmedName) errors.name = "Role name is required.";
    else if (trimmedName.length < 3 || trimmedName.length > 40) errors.name = "Use 3 to 40 characters.";
    else if (!/^[A-Za-z][A-Za-z0-9 _]*$/.test(trimmedName)) {
      errors.name = "Start with a letter and use only letters, numbers, spaces, or underscores.";
    }
    setFieldErrors(errors);
    setFormError("");
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      if (role) {
        await updateAdminRole(role.id, {
          ...(role.isSystem ? {} : { name: trimmedName }),
          tablePrivileges,
          systemCapabilities,
          grantOption,
        });
      } else {
        await createAdminRole({
          name: trimmedName,
          tablePrivileges,
          systemCapabilities,
          grantOption,
        });
      }
      toast.success(`Role ${role ? "updated" : "created"}.`);
      await onCreated();
      onClose();
    } catch (error: unknown) {
      const response = (error as { response?: { data?: { message?: string; fieldErrors?: Record<string, string> } } })?.response?.data;
      if (response?.fieldErrors) setFieldErrors(response.fieldErrors);
      const message = response?.message || `Could not ${role ? "update" : "create"} role.`;
      setFormError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[calc(100vh-32px)] overflow-y-auto rounded-lg bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e2e8f0] bg-white px-6 py-4">
          <div>
            <h2 className="text-[17px] font-bold text-[#0b1c30]">{role ? "Edit Role" : "Create Role"}</h2>
            <p className="mt-0.5 text-[12px] text-[#64748b]">Choose the table privileges this role can use.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="text-[12px] font-medium text-[#64748b]">
              Role name
              <input
                value={name}
                disabled={Boolean(role?.isSystem)}
                aria-invalid={Boolean(fieldErrors.name)}
                onChange={(event) => {
                  setName(event.target.value);
                  setFieldErrors((current) => ({ ...current, name: "" }));
                  setFormError("");
                }}
                className={`mt-1 w-full rounded-md border px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] disabled:bg-[#f1f5f9] ${fieldErrors.name ? "border-[#ba1a1a]" : "border-[#e2e8f0]"}`}
              />
            </label>
            {fieldErrors.name && <p className="mt-1 text-[11px] text-[#ba1a1a]">{fieldErrors.name}</p>}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[14px] font-semibold text-[#0b1c30]">Table privileges</h3>
                <p className="text-[11px] text-[#64748b]">Only application-managed tables are available.</p>
              </div>
              <div className="relative w-56">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tables" className="w-full rounded-md border border-[#e2e8f0] py-1.5 pl-8 pr-3 text-[12px] outline-none focus:border-[#006e2f]" />
              </div>
            </div>

            {loadingCatalog ? <LoadingSpinner message="Loading privileges..." /> : (
              <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border border-[#e2e8f0] p-2">
                {visibleTables.map((table) => {
                  const allowed = allowedPolicy[table.name] ?? [];
                  const selected = tablePrivileges[table.name] ?? [];
                  return (
                    <div key={table.name} className="rounded-md border border-[#e2e8f0] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#0b1c30]">{table.name}</span>
                        <div className="flex gap-3 text-[11px]">
                          <button type="button" onClick={() => selectAll(table.name)} className="text-[#005ac2] hover:underline">Select all</button>
                          <button type="button" onClick={() => clearTable(table.name)} className="text-[#ba1a1a] hover:underline">Clear</button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allowed.map((action) => (
                          <label key={action} className={`cursor-pointer rounded-md border px-2.5 py-1 text-[11px] font-semibold ${selected.includes(action) ? "border-[#006e2f] bg-green-50 text-[#006e2f]" : "border-[#e2e8f0] text-[#64748b]"}`}>
                            <input type="checkbox" className="sr-only" checked={selected.includes(action)} onChange={() => togglePrivilege(table.name, action)} />
                            {action}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {visibleTables.length === 0 && <p className="py-6 text-center text-[12px] text-[#94a3b8]">No manageable tables match this search.</p>}
              </div>
            )}
          </div>

          {availableCapabilities.length > 0 && (
            <div>
              <h3 className="mb-2 text-[14px] font-semibold text-[#0b1c30]">System capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {availableCapabilities.map((capability) => (
                  <label key={capability} className={`cursor-pointer rounded-md border px-3 py-1.5 text-[11px] font-semibold ${systemCapabilities.includes(capability) ? "border-[#006e2f] bg-green-50 text-[#006e2f]" : "border-[#e2e8f0] text-[#64748b]"}`}>
                    <input type="checkbox" className="sr-only" checked={systemCapabilities.includes(capability)} onChange={() => setSystemCapabilities((current) => current.includes(capability) ? current.filter((value) => value !== capability) : [...current, capability])} />
                    {capability}
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-start gap-3 rounded-md border border-[#e2e8f0] p-3">
            <input type="checkbox" checked={grantOption} onChange={(event) => setGrantOption(event.target.checked)} className="mt-0.5" />
            <span>
              <span className="block text-[13px] font-semibold text-[#0b1c30]">Allow privilege delegation</span>
              <span className="block text-[11px] text-[#64748b]">The role may delegate only a subset of privileges it already owns.</span>
            </span>
          </label>
          {formError && <p role="alert" className="rounded-md border border-[#f2b8b5] bg-[#fff8f7] px-3 py-2 text-[12px] text-[#ba1a1a]">{formError}</p>}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#e2e8f0] bg-white px-6 py-4">
          <button onClick={onClose} className="rounded-md border border-[#bccbb9] px-4 py-2 text-[12px] font-medium text-[#374151]">Cancel</button>
          <button onClick={handleSave} disabled={saving || loadingCatalog} className="rounded-md bg-[#006e2f] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : role ? "Update Role" : "Create Role"}</button>
        </div>
      </div>
    </div>
  );
}
