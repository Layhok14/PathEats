import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import api from "../../shared/services/axiosService";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const availablePrivileges = [
  "SELECT",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "ALTER",
  "DROP",
];

const availableTables = [
  "audit_logs",
  "bookmarks",
  "menu_items",
  "place_categories",
  "place_hours",
  "places",
  "reviews",
  "routes",
  "search_history",
  "support_tickets",
  "support_tips",
  "user_preferences",
  "users",
];

export default function CreateRoleModal({ isOpen, onClose, onCreated }: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [privileges, setPrivileges] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [grantOption, setGrantOption] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePrivilege = (item: string) => {
    setPrivileges((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
  };

  const toggleTable = (item: string) => {
    setTables((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error("Role name is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/admin/roles", {
        name: roleName.trim(),
        privileges,
        tables,
        grantOption,
      });

      if (response.data.success) {
        toast.success(`Role "${roleName.trim()}" created.`);
        setRoleName("");
        setPrivileges([]);
        setTables([]);
        setGrantOption(false);
        onCreated?.();
        onClose();
      } else {
        toast.error(response.data.message || "Create role failed.");
      }
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Create role failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="relative z-50 bg-white rounded-xl shadow-xl w-full max-w-[700px] max-h-[calc(100vh-32px)] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-[#0b1c30]">Create New Role</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-[#334155] hover:bg-[#f1f5f9]"
            aria-label="Close"
          >
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
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#006e2f]"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-3 font-medium">Select Privileges</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePrivileges.map((item) => (
              <label key={item} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={privileges.includes(item)}
                  onChange={() => togglePrivilege(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block mb-3 font-medium">Select Tables</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableTables.map((table) => (
              <label key={table} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={tables.includes(table)}
                  onChange={() => toggleTable(table)}
                />
                {table}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={grantOption}
              onChange={() => setGrantOption((value) => !value)}
            />
            Allow this role to grant privileges
          </label>
        </div>

        <div className="flex justify-end gap-3 sticky bottom-0 bg-white pt-3">
          <button
            onClick={onClose}
            className="border border-[#e2e8f0] px-4 py-2 rounded-lg hover:bg-[#f8fafc]"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-[#006e2f] text-white px-4 py-2 rounded-lg hover:bg-[#005a26] disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
