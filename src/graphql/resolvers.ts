import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Context, LoginInput, RegisterInput, AuthPayload } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: Context) => {
      if (!user) return null;
      return User.findById(user.id);
    },
  },

  Mutation: {
    register: async (_: any, { email, password }: RegisterInput): Promise<AuthPayload> => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = await User.create({ email, password });
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt,
        },
      };
    },

    login: async (_: any, { email, password }: LoginInput): Promise<AuthPayload> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt,
        },
      };
    },

    logout: async (_: any, __: any, { user }: Context): Promise<boolean> => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      return true;
    },
  },
}; 