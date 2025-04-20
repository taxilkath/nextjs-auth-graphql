import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  loginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface Context {
  user: IUser | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface AuthPayload {
  token: string;
  user: {
    id: string;
    email: string;
    createdAt: Date;
  };
} 