import { UserRole } from "../models/user.model";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        role: UserRole;
        username: string;
      };
    }
  }
}