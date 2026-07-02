import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Home } from "lucide-react";

const NAVY = "#0b1c30";
const GREEN = "#006e2f";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4 font-bold" style={{ color: GREEN }}>404</div>
        <h1 className="text-xl font-bold mb-2" style={{ color: NAVY }}>Page not found</h1>
        <p className="text-[13px] text-[#64748b] mb-6">
          The page <code className="text-[#d4183d] bg-red-50 px-1.5 py-0.5 rounded text-[12px]">{location.pathname}</code> does not exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={14} /> Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 text-[12px] font-medium rounded-lg border-none text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: GREEN }}
          >
            <Home size={14} /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
