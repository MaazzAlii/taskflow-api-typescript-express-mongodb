import { Response } from 'express';
import User, { IUser } from '../models/User';
import generateToken from '../utils/generateToken';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest, ApiResponse } from '../types';

interface AuthPayload {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

const toAuthPayload = (user: IUser): AuthPayload => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(String(user._id)),
});

export const registerUser = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<AuthPayload>>) => {
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, message: 'User with this email already exists' });
      return;
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, data: toAuthPayload(user) });
  }
);

export const loginUser = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<AuthPayload>>) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    res.status(200).json({ success: true, data: toAuthPayload(user) });
  }
);

export const getMe = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<IUser>>) => {
    res.status(200).json({ success: true, data: req.user });
  }
);
