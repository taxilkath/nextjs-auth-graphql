import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  loginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it's being modified
    if (this.isModified('password')) {
      console.log(`Hashing password for user: ${this.email}`);
      // The password is already SHA-256 hashed from the client
      // We'll hash it again with bcrypt for storage
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log(`Password hashed for user: ${this.email}`);
    }
    next();
  } catch (error) {
    console.error(`Error hashing password for user: ${this.email}`, error);
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    console.log(`Comparing password for user: ${this.email}`);
    // The candidatePassword is already SHA-256 hashed from the client
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log(`Password comparison result for user: ${this.email}: ${result}`);
    return result;
  } catch (error) {
    console.error(`Error comparing password for user: ${this.email}`, error);
    return false;
  }
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User; 