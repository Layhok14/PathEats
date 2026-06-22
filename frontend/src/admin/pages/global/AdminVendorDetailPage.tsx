import { useParams } from "react-router";
import { VendorDetailView } from "../../../shared/components/VendorDetailView";

export default function AdminVendorDetailPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  if (!vendorId) return <p className="p-8 text-[13px] text-[#94a3b8]">Vendor ID is missing.</p>;
  return <VendorDetailView vendorId={vendorId} backPath="/admin/restaurants" title="Vendor Detail" />;
}
