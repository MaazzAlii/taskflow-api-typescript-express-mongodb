import { Request, Response, NextFunction } from 'express';

/**
 * Generic wrapper for async Express route handlers.
 * R is the specific Request type (e.g. AuthRequest), so handlers keep
 * full type-safety on req.user etc. instead of falling back to `any`.
 */
export const asyncHandler = <R extends Request = Request>(
  fn: (req: R, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: R, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
