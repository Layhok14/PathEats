export const restrictToRoles = (...permittedRoles) => {
  return (req, res, next) => {
    const activeRole = req.user?.role_scope;

    if (!activeRole) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!permittedRoles.includes(activeRole)) {
      return res.status(403).json({
        success: false,
        message: `Access Denied. Required: [${permittedRoles.join(", ")}]. Active: ${activeRole}`,
      });
    }

    next();
  };
};
