import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/errors.js';

export const protect = async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required.', 401, true));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('User not found.', 401, true));
    }

    request.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token.', 401, true));
  }
};

export const authorize = (...roles) => (request, response, next) => {
  if (!request.user || !roles.includes(request.user.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403, true));
  }

  next();
};
