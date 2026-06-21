/**
 * RBAC bypass — always passes for testing.
 */
export const restrictToRoles = (...permittedRoles) => {
  return (req, res, next) => {
    next();
  };
};
