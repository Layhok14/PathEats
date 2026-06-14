/**
 * RBAC middleware factory.
 * Use: router.get("/path", restrictToRoles("GLOBAL_ADMIN"), handler)
 */
export const restrictToRoles = (...permittedRoles) => {
  return (req, res, next) => {
    const activeRole = req.user?.role_scope;
    if (!activeRole || !permittedRoles.includes(activeRole)) {
      return res.status(403).json({
        success: false,
        message: `Access Denied. Required: [${permittedRoles.join(", ")}]. Active: ${activeRole || "Unauthenticated"}`,
      });
    }
    next();
  };
};
