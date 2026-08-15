import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { TaskStatus } from '../types';

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: Date;
  category?: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);

export default Task;
