import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AdminPageWrapper({ children }: Props) {
  return (
    <div className="relative w-full min-h-screen admin-page-wrapper">
      <style>{`
        /* Hide all Figma sidebar elements */
        .admin-page-wrapper [data-name^="Aside"] {
          display: none !important;
        }
        /* Remove left padding from root that compensated for sidebar */
        .admin-page-wrapper > div:first-child {
          padding-left: 0 !important;
        }
        /* Fix top header bar — reset from left-[260px] to left-0, full width */
        .admin-page-wrapper [data-name^="Header"] {
          left: 0 !important;
          width: 100% !important;
          right: 0 !important;
        }
      `}</style>
      {children}
    </div>
  );
}
