import { useState, useEffect } from "react";
import { createAdminRole, updateAdminRole, type AdminRole } from "../services/adminDashboardService";

interface Props {
  isOpen: boolean;
  role: AdminRole | null;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateRoleModal({ isOpen, role, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role) setName(role.name);
    else setName("");
  }, [role]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (role) {
        await updateAdminRole(role.id, { name: name.trim() });
      } else {
        await createAdminRole({ name: name.trim() });
      }
      onCreated();
      onClose();
    } catch (err) {
      console.error("Failed to save role:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-[16px] font-semibold mb-4">{role ? "Edit Role" : "Create Role"}</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Role name"
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-[#006e2f] mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-[#64748b] hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={handleSave} disabled={saving || !name.trim()} className="px-4 py-2 text-[13px] bg-[#006e2f] text-white rounded-lg hover:bg-[#005a26] disabled:opacity-50">
            {saving ? "Saving..." : role ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
