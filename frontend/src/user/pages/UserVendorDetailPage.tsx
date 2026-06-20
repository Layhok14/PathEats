// Vendor detail page for direct links — Owner: Kong Leak Smey.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Loader2, ArrowLeft } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { getVendorById } from "../services/vendorService";
import { VendorDetail } from "../components/VendorDetail";

export default function UserVendorDetailPage() {
  const { darkMode, tm } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVendor() {
      try {
        setLoading(true);
        const data = await getVendorById(id);
        if (data) {
          setVendor(data);
        } else {
          setError("Vendor not found");
        }
      } catch (err) {
        console.error("Failed to load vendor:", err);
        setError("Failed to load vendor");
      } finally {
        setLoading(false);
      }
    }
    loadVendor();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    navigate("/user");
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center" style={{ background: tm.appBg }}>
        <Loader2 size={32} className="animate-spin" style={{ color: tm.primary }} />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4" style={{ background: tm.appBg }}>
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: tm.text1 }}>Vendor Not Found</h2>
          <p className="mt-2" style={{ color: tm.text3 }}>{error || "Unknown error"}</p>
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-xl font-medium transition-colors"
          style={{ background: tm.primary, color: tm.primaryText }}
        >
          <ArrowLeft size={14} className="inline mr-1" /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex overflow-hidden" style={{ background: tm.appBg }}>
      <VendorDetail
        vendor={vendor}
        onClose={handleClose}
        isFavorite={false}
        onToggleFavorite={() => {}}
      />
    </div>
  );
}