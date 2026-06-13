import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface PhotoUploadProps {
  value: string; // current preview URL (object URL or empty)
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "wide";
}

export function PhotoUpload({ value, onChange, label = "Upload Photo", aspectRatio = "wide" }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggingOver, setDraggingOver] = useState(false);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    // Revoke previous object URL to avoid memory leaks
    if (value && value.startsWith("blob:")) URL.revokeObjectURL(value);
    onChange(URL.createObjectURL(file));
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const height = aspectRatio === "square" ? "160px" : "144px";

  if (value) {
    return (
      <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", height }}>
        <img src={value} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.5)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "12px", cursor: "pointer" }}
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => onChange("")}
            style={{ padding: "5px 6px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.5)", color: "white", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <X size={13} />
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} style={{ display: "none" }} />
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
      onDragLeave={() => setDraggingOver(false)}
      onDrop={onDrop}
      style={{
        border: `1.5px dashed ${draggingOver ? "var(--brand-green)" : "var(--brand-card-border)"}`,
        borderRadius: "8px",
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        background: draggingOver ? "#f0fdf4" : "var(--card)",
        transition: "all 0.15s",
      }}
    >
      <div style={{ width: "44px", height: "44px", borderRadius: "9999px", background: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {draggingOver ? <ImageIcon size={20} style={{ color: "var(--brand-green)" }} /> : <Upload size={20} style={{ color: "var(--brand-text-muted)" }} />}
      </div>
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", margin: 0, textAlign: "center" }}>
        {draggingOver ? "Drop to upload" : label}
      </p>
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", margin: 0 }}>
        PNG, JPG, WEBP · from your device or Google Drive
      </p>
      <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} style={{ display: "none" }} />
    </div>
  );
}
