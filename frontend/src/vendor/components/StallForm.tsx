import { Upload } from "lucide-react";
import { Switch } from "../../app/components/ui/switch";
import { STALL_CATEGORIES } from "../../shared/constants/categories";
import { OperatingHoursEditor } from "./OperatingHoursEditor";
import type { StallFormData, StallCategory } from "../../shared/types";

interface StallFormProps {
  value: StallFormData;
  onChange: (data: StallFormData) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "var(--foreground)",
  fontFamily: "var(--font-sans, Poppins, sans-serif)",
  display: "block",
  marginBottom: "0.375rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)",
  background: "var(--input-background)",
  color: "var(--foreground)",
  borderRadius: "var(--radius)",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  fontFamily: "var(--font-sans, Poppins, sans-serif)",
  outline: "none",
};

export function StallForm({ value, onChange }: StallFormProps) {
  function set<K extends keyof StallFormData>(key: K, val: StallFormData[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Basic info */}
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-medium" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Basic Information
        </h3>

        {/* Stall name */}
        <div>
          <label style={labelStyle}>Stall Name</label>
          <input
            type="text"
            placeholder="e.g. Healthy Shop"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Photo upload */}
        <div>
          <label style={labelStyle}>Stall Photo</label>
          <div
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-[var(--radius-lg)] border-2 border-dashed cursor-pointer"
            style={{ borderColor: "var(--border)", background: "var(--muted)" }}
          >
            {value.photoUrl ? (
              <img
                src={value.photoUrl}
                alt="Stall preview"
                className="h-32 w-full object-cover rounded-[var(--radius)]"
              />
            ) : (
              <>
                <Upload size={24} style={{ color: "var(--muted-foreground)" }} />
                <span className="text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)" }}>
                  Drag & drop or click to upload
                </span>
              </>
            )}
            <input
              type="url"
              placeholder="Or paste image URL"
              value={value.photoUrl}
              onChange={(e) => set("photoUrl", e.target.value)}
              style={{ ...inputStyle, marginTop: "0.5rem" }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            placeholder="Describe your stall, specialties, and what makes it unique..."
            value={value.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
      </section>

      {/* Category */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Primary Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {STALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => set("category", cat as StallCategory)}
              className="px-4 py-1.5 rounded-full text-sm border transition-colors"
              style={{
                background: value.category === cat ? "var(--primary)" : "var(--card)",
                color: value.category === cat ? "var(--primary-foreground)" : "var(--foreground)",
                borderColor: value.category === cat ? "var(--primary)" : "var(--border)",
                fontFamily: "var(--font-sans, Poppins, sans-serif)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Operating hours */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Operating Hours
        </h3>
        <OperatingHoursEditor
          value={value.operatingHours}
          onChange={(hours) => set("operatingHours", hours)}
        />
      </section>

      {/* Operating status */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Operating Status
        </h3>
        <div className="flex items-center gap-3">
          <Switch
            checked={value.status === "open"}
            onCheckedChange={(checked) => set("status", checked ? "open" : "closed")}
          />
          <span className="text-sm" style={{ color: "var(--foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)" }}>
            {value.status === "open" ? "Currently Open — Visible to customers" : "Currently Closed"}
          </span>
        </div>
      </section>

      {/* Location */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-sans, Poppins, sans-serif)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Location
        </h3>
        <div>
          <label style={labelStyle}>Landmark / Station</label>
          <input
            type="text"
            placeholder="e.g. Near Phnom Penh Central Market"
            value={value.location.landmark}
            onChange={(e) => set("location", { ...value.location, landmark: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={value.location.latitude}
              onChange={(e) => set("location", { ...value.location, latitude: parseFloat(e.target.value) || 0 })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={value.location.longitude}
              onChange={(e) => set("location", { ...value.location, longitude: parseFloat(e.target.value) || 0 })}
              style={inputStyle}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
