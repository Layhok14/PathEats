/**
 * Wraps an async route handler so thrown errors
 * are forwarded to the global error middleware via next().
 *
 * Usage:
 *   router.get("/path", catchAsync(controller.method));
 */
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
