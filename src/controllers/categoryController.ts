import { Response } from 'express';
import Category, { ICategory } from '../models/Category';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest, ApiResponse } from '../types';

export const getCategories = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<ICategory[]>>) => {
    const categories = await Category.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  }
);

export const getCategory = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<ICategory>>) => {
    const category = await Category.findOne({ _id: req.params.id, user: req.user!._id });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.status(200).json({ success: true, data: category });
  }
);

export const createCategory = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<ICategory>>) => {
    const { name, description } = req.body as { name?: string; description?: string };
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }
    const category = await Category.create({ name, description, user: req.user!._id });
    res.status(201).json({ success: true, data: category });
  }
);

export const updateCategory = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<ICategory>>) => {
    const existing = await Category.findOne({ _id: req.params.id, user: req.user!._id });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: category as ICategory });
  }
);

export const deleteCategory = asyncHandler<AuthRequest>(
  async (req, res: Response<ApiResponse<null>>) => {
    const category = await Category.findOne({ _id: req.params.id, user: req.user!._id });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category deleted' });
  }
);
