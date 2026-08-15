import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { protect } from '../middleware/auth';

const router = Router();

router.route('/').get(protect, getCategories).post(protect, createCategory);
router
  .route('/:id')
  .get(protect, getCategory)
  .patch(protect, updateCategory)
  .delete(protect, deleteCategory);

export default router;
