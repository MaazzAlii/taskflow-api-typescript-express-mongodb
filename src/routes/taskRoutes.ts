import { Router } from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { protect } from '../middleware/auth';

const router = Router();

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').get(protect, getTask).patch(protect, updateTask).delete(protect, deleteTask);

export default router;
