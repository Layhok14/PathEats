import { ImageOff } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";

export function MenuGallery({ vendor }) {
  const { tm, darkMode } = useTheme();
  const items = vendor.menu || [];

  return (
    <div
      style={{
        background: darkMode
          ? "rgba(15,23,42,0.94)"
          : "rgba(255,255,255,0.96)",
        borderTop: `1px solid ${tm.border}`,
        backdropFilter: "blur(12px)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-2.5 px-4 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {items.length === 0 ? (
          <div className="text-xs py-2 w-full text-center" style={{ color: tm.text4 }}>
            No menu items available
          </div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="shrink-0 w-[88px]">
              <div className="w-[88px] h-[72px] rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                {item.image_url || item.storage_image ? (
                  <img src={item.image_url || item.storage_image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: tm.text5 }}>
                    <ImageOff size={16} />
                  </div>
                )}
              </div>
              <div className="mt-1 text-[10px] font-medium leading-tight line-clamp-2" style={{ color: tm.text1 }}>
                {item.name}
              </div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: tm.primary }}>
                ${Number(item.price).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}