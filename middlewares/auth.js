import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    // creating Error Object
    return next(new ErrorHandler("User Not Authorized", 401));
  }
  // Verify the Token with Secreat Key
  // here we Get User details in Docoded
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);
// Now auth ke Baaad ka process Kro
  next();
});
