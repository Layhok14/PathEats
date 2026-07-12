import { ImageOff } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";

type VendorPhotoData = {
  name?: string | null;
  photo_url?: string | null;
  photoUrl?: string | null;
  storage_image?: string | null;
};

type VendorPhotoProps = {
  vendor: VendorPhotoData;
  className?: string;
};

export function getVendorPhotoUrl(vendor: VendorPhotoData) {
  const rawUrl = vendor.photo_url ?? vendor.photoUrl ?? vendor.storage_image ?? "";
  return typeof rawUrl === "string" ? rawUrl.trim() : "";
}

export function VendorPhoto({ vendor, className = "" }: VendorPhotoProps) {
  const { tm } = useTheme();
  const imageUrl = getVendorPhotoUrl(vendor);
  const label = vendor.name?.trim() || "Vendor";

  if (imageUrl) {
    return <img src={imageUrl} alt={label} loading="lazy" className={className} />;
  }

  return (
    <div
      role="img"
      aria-label={`${label} photo unavailable`}
      className={`flex items-center justify-center ${className}`}
      style={{ background: tm.surface2, color: tm.text4 }}
    >
      <ImageOff size={18} aria-hidden="true" />
    </div>
  );
}
