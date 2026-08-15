import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateToken = (userId: Types.ObjectId | string): string => {
  const secret: string = process.env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id: userId.toString() }, secret, options);
};

export default generateToken;
