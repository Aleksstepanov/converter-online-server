import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    refreshToken?: string;
  };
}
