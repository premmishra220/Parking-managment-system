import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/errors.js';

const generateToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required.', 400, true);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409, true);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: 'user'
  });

  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;

  return {
    token: generateToken(user),
    user: sanitizedUser
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Email and password are required.', 400, true);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('Invalid email or password.', 401, true);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password.', 401, true);
  }

  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;

  return {
    token: generateToken(user),
    user: sanitizedUser
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError('User not found.', 404, true);
  }
  return user;
};

export const setAdminUser = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@parkconnect.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@parkconnect.com',
      password: hashedPassword,
      role: 'admin'
    });
  }
};
