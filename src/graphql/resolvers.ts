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
      console.log(`Login attempt for email: ${email}`);
      
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`User not found: ${email}`);
        throw new Error('Invalid credentials');
      }

      console.log(`User found: ${email}, loginAttempts: ${user.loginAttempts}, lockedUntil: ${user.lockedUntil}`);

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        const remainingTime = Math.ceil((user.lockedUntil.getTime() - new Date().getTime()) / 1000 / 60);
        console.log(`Account locked for ${email}, remaining time: ${remainingTime} minutes`);
        throw new Error(`Account is locked. Please try again in ${remainingTime} minutes.`);
      }

      const isValid = await user.comparePassword(password);
      console.log(`Password validation for ${email}: ${isValid}`);
      
      if (!isValid) {
        console.log(`Invalid password for ${email}, current attempts: ${user.loginAttempts}`);
        
        // Increment login attempts using findOneAndUpdate
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { 
            $inc: { loginAttempts: 1 },
            ...(user.loginAttempts + 1 >= 5 ? { 
              lockedUntil: new Date(Date.now() + 15 * 60 * 1000) 
            } : {})
          },
          { new: true }
        );
        
        console.log(`Updated user: ${email}, new loginAttempts: ${updatedUser?.loginAttempts}, lockedUntil: ${updatedUser?.lockedUntil}`);
        
        if (updatedUser && updatedUser.loginAttempts >= 5) {
          console.log(`Account locked for ${email} after 5 failed attempts`);
          throw new Error('Account has been locked due to too many failed attempts. Please try again in 15 minutes.');
        }
        
        console.log(`Failed login for ${email}, ${5 - updatedUser!.loginAttempts} attempts remaining`);
        throw new Error(`Invalid credentials. ${5 - updatedUser!.loginAttempts} attempts remaining.`);
      }

      console.log(`Successful login for ${email}, resetting login attempts`);
      
      // Reset login attempts on successful login using findOneAndUpdate
      const resetUser = await User.findOneAndUpdate(
        { _id: user._id },
        { 
          $set: { 
            loginAttempts: 0,
            lockedUntil: null
          }
        },
        { new: true }
      );
      
      console.log(`Reset user: ${email}, loginAttempts: ${resetUser?.loginAttempts}, lockedUntil: ${resetUser?.lockedUntil}`);

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