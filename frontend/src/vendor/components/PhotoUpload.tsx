import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import api from "../../shared/services/axiosService";

export interface UploadedImageMetadata {
  bucketName: string;
  objectPath: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string;
  publicUrl?: string;
}

interface PhotoUploadProps {
  value: string;
  onChange: (url: string, storageImage?: UploadedImageMetadata | null) => void;
  label?: string;
  aspectRatio?: "square" | "wide";
}

export function PhotoUpload({ value, onChange, label = "Upload Photo", aspectRatio = "wide" }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggingOver, setDraggingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    const form = new FormData();
    form.append("image", file);

    try {
      setUploading(true);
      const response = await api.post<{
        success: boolean;
        data: { url: string; storageImage: UploadedImageMetadata };
      }>("/vendor/uploads/images", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onChange(response.data.data.url, response.data.data.storageImage);
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed. Try another image.");
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  const height = aspectRatio === "square" ? "160px" : "144px";

  if (value) {
    return (
      <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", height }}>
        <img src={value} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {uploading && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>
            Uploading...
          </div>
        )}
        <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.5)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "12px", cursor: uploading ? "not-allowed" : "pointer" }}
          >
            Change
          </button>
          <button
            type="button"
            onClick={() => onChange("", null)}
            disabled={uploading}
            style={{ padding: "5px 6px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.5)", color: "white", cursor: uploading ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}
          >
            <X size={13} />
          </button>
        </div>
        {error && (
          <div style={{ position: "absolute", left: "8px", right: "8px", bottom: "8px", borderRadius: "6px", background: "rgba(186,26,26,0.9)", color: "white", padding: "6px 8px", fontFamily: "Poppins, sans-serif", fontSize: "11px" }}>
            {error}
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} style={{ display: "none" }} />
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (!uploading) inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggingOver(true);
      }}
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
        cursor: uploading ? "progress" : "pointer",
        background: draggingOver ? "#f0fdf4" : "var(--card)",
        transition: "all 0.15s",
      }}
    >
      <div style={{ width: "44px", height: "44px", borderRadius: "9999px", background: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {draggingOver ? <ImageIcon size={20} style={{ color: "var(--brand-green)" }} /> : <Upload size={20} style={{ color: "var(--brand-text-muted)" }} />}
      </div>
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", margin: 0, textAlign: "center" }}>
        {uploading ? "Uploading..." : draggingOver ? "Drop to upload" : label}
      </p>
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", margin: 0 }}>
        PNG, JPG, WEBP, GIF. Max 5 MB
      </p>
      {error && (
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "#ba1a1a", margin: 0, textAlign: "center" }}>
          {error}
        </p>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} style={{ display: "none" }} />
    </div>
  );
}
