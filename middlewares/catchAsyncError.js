// ! To handle Async Errors 
// * It will take Complte Fn As Input and then return a Promise
// * ex- login Method , register or any other

export const catchAsyncErrors = (theFunction) => {
  return (req, res, next) => {
    // if resloved them return function as run next fn
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};
