import { useLocation } from "react-router";

export type ManagementPortalBase = "/admin" | "/business";

export function useManagementPortalBase(): ManagementPortalBase {
  const { pathname } = useLocation();
  return pathname.startsWith("/business") ? "/business" : "/admin";
}

export function portalPath(base: ManagementPortalBase, path = "") {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return suffix === "/" ? base : `${base}${suffix}`;
}
