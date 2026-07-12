// Vendor detail page for direct links — Owner: Kong Leak Smey.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { useAuth } from "../../shared/hooks/useAuth";
import { useBookmarks } from "../hooks/useBookmarks";
import { getVendorById } from "../services/vendorService";
import { VendorDetail } from "../components/VendorDetail";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";
import type { Vendor } from "../../shared/types";

export default function UserVendorDetailPage() {
  const { darkMode, tm } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [vendor, setVendor] = useState<Vendor | null>(null);
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

  function handleToggleBookmark() {
    if (!vendor) return;
    if (user?.role_scope !== "CONSUMER") {
      navigate("/user/login");
      return;
    }
    toggleBookmark(vendor.id);
  }

  if (loading) {
    return <LoadingSpinner message="Loading vendor details..." />;
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
        isFavorite={bookmarks.has(String(vendor.id))}
        onToggleFavorite={handleToggleBookmark}
      />
    </div>
  );
}
