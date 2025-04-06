import { User } from '../../user/user.entity';

declare global {
  namespace Express {
    // Augment Express Request interface with user
    interface Request {
      user?: User;
    }
  }
} 