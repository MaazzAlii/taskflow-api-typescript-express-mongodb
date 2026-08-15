import { Response } from 'express';
import Task, { ITask } from '../models/Task';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest, ApiResponse, TaskStatus } from '../types';

interface CreateTaskBody {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  category?: string;
}

export const getTasks = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<ITask[]>>) => {
    const filter: Record<string, unknown> = { user: req.user!._id };
    if (req.query.status) filter.status = req.query.status;

    const tasks = await Task.find(filter).populate('category', 'name').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  }
);

export const getTask = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<ITask>>) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user!._id }).populate('category', 'name');
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(200).json({ success: true, data: task });
  }
);

export const createTask = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<ITask>>) => {
    const { title, description, status, dueDate, category } = req.body as CreateTaskBody;
    if (!title) {
      res.status(400).json({ success: false, message: 'Task title is required' });
      return;
    }
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      category,
      user: req.user!._id,
    });
    res.status(201).json({ success: true, data: task });
  }
);

export const updateTask = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<ITask>>) => {
    const existing = await Task.findOne({ _id: req.params.id, user: req.user!._id });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: task as ITask });
  }
);

export const deleteTask = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<null>>) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user!._id });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    await task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted' });
  }
);
