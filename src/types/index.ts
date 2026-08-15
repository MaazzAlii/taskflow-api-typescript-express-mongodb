import { Request } from 'express';
import { IUser } from '../models/User';

/**
 * Generic API response envelope used across every controller.
 * T is the shape of the `data` payload for that specific endpoint,
 * so callers get full type-safety on the response body instead of `any`.
 *
 * Example: ApiResponse<ITask> for a single task, ApiResponse<ITask[]> for a list.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
}

/** Express Request extended with the authenticated user attached by the auth middleware. */
export interface AuthRequest extends Request {
  user?: IUser;
}

export type UserRole = 'user' | 'admin';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
