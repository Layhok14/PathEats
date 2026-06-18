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
// what it does: it is helper function that execute the function of the route handler. 
// It get the function and return a route handler function which is what express expect. (req,res,next)
// If the functrion is not async, the Promise.resolve() makes it async and execute it.
// if it succeeds, the applicaton preceed. 
// If there is any issue, then it is yield the error meessage for us using the catch(next).
// error is passed\to the next() function. Once next(err) is called, Express skips all remaining middleware, 
// and execute the global middleware.

// this reduces the try and catch condition in each route handling.