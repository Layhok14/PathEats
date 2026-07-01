import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createAdminRole, updateAdminRole, getAdminDatabaseTables, type AdminRole } from "../services/adminDashboardService";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  role?: AdminRole | null;
}

const availablePrivileges = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP"];

const availableDatabases = ["patheats_db"];

export default function CreateRoleModal({ isOpen, onClose, onCreated, role }: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [selectedDb, setSelectedDb] = useState("patheats_db");
  const [tablePrivileges, setTablePrivileges] = useState<Record<string, string[]>>({});
  const [grantOption, setGrantOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const isEditing = Boolean(role);

  useEffect(() => {
    if (!isOpen) return;
    setRoleName(role?.name ?? "");
    setSelectedDb("patheats_db");
    setTablePrivileges(role?.tablePrivileges ?? {});
    setGrantOption(role?.grantOption ?? false);
  }, [isOpen, role]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setTablesLoading(true);
      try {
        const dbTables = await getAdminDatabaseTables();
        setTables(dbTables);
      } catch {
        setTables([]);
      } finally {
        setTablesLoading(false);
      }
    })();
  }, [isOpen]);

  const toggleTablePrivilege = (table: string, privilege: string) => {
    setTablePrivileges((prev) => {
      const current = prev[table] ?? [];
      const updated = current.includes(privilege)
        ? current.filter((p) => p !== privilege)
        : [...current, privilege];
      return { ...prev, [table]: updated };
    });
  };

  const selectAllForTable = (table: string) => {
    setTablePrivileges((prev) => ({ ...prev, [table]: [...availablePrivileges] }));
  };

  const clearForTable = (table: string) => {
    setTablePrivileges((prev) => {
      const next = { ...prev };
      delete next[table];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error("Role name is required.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: roleName.trim(),
        tablePrivileges,
        grantOption,
      };

      if (isEditing && role) {
        await updateAdminRole(role.id, payload);
      } else {
        await createAdminRole(payload);
      }

      toast.success(`Role "${roleName.trim()}" ${isEditing ? "updated" : "created"}.`);
      setRoleName("");
      setSelectedDb("patheats_db");
      setTablePrivileges({});
      setGrantOption(false);
      onCreated?.();
      onClose();
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || `${isEditing ? "Update" : "Create"} role failed.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="relative z-50 bg-white rounded-xl shadow-xl w-full max-w-[900px] max-h-[calc(100vh-32px)] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-[#0b1c30]">{isEditing ? "Edit Role" : "Create New Role"}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-[#334155] hover:bg-[#f1f5f9]" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Role Name</label>
          <input
            type="text"
            placeholder="Enter role name"
            value={roleName}
            onChange={(event) => setRoleName(event.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#006e2f] bg-white text-[#374151]"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Database</label>
          <select
            value={selectedDb}
            onChange={(e) => setSelectedDb(e.target.value)}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#006e2f] bg-white text-[#374151]"
          >
            {availableDatabases.map((db) => (
              <option key={db} value={db}>{db}</option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <label className="font-medium">Table Privileges</label>
            {tablesLoading && <span className="text-[12px] text-[#94a3b8]">Loading tables...</span>}
          </div>
          {tables.length === 0 && !tablesLoading && (
            <p className="text-[13px] text-[#94a3b8]">No tables available.</p>
          )}
          <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto border border-[#e2e8f0] rounded-lg p-2">
            {tables.map((table) => {
              const privs = tablePrivileges[table] ?? [];
              return (
                <div key={table} className="border border-[#e2e8f0] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-[#0b1c30]">{table}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => selectAllForTable(table)}
                        className="text-[11px] text-[#005ac2] hover:underline"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => clearForTable(table)}
                        className="text-[11px] text-[#ba1a1a] hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availablePrivileges.map((priv) => (
                      <label
                        key={priv}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] cursor-pointer border transition-colors ${
                          privs.includes(priv)
                            ? "border-[#006e2f] bg-[#dcfce7] text-[#006e2f]"
                            : "border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={privs.includes(priv)}
                          onChange={() => toggleTablePrivilege(table, priv)}
                          className="sr-only"
                        />
                        {priv}
                      </label>
                    ))}
                    {privs.length === 0 && (
                      <span className="text-[11px] text-[#94a3b8] italic">No privileges — role cannot access this table</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={grantOption} onChange={() => setGrantOption((value) => !value)} />
            Allow this role to grant privileges
          </label>
        </div>

        <div className="flex justify-end gap-3 sticky bottom-0 bg-white pt-3 border-t border-[#e2e8f0]">
          <button onClick={onClose} className="border border-[#e2e8f0] px-4 py-2 rounded-lg hover:bg-[#f8fafc]">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-[#006e2f] text-white px-4 py-2 rounded-lg hover:bg-[#005a26] disabled:opacity-60"
          >
            {loading ? "Saving..." : isEditing ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
