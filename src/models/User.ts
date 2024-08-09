import bcrypt from 'bcrypt';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface AuthToken {
  accessToken: string;
  kind: string;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  surname: string;
  tokens: AuthToken[];
  role: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export enum UserRole {
  admin = 'admin',
  editor = 'editor',
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    tokens: { type: [{ accessToken: String, kind: String }], default: [] },
    role: {
      type: String,
      enum: [UserRole.admin, UserRole.editor],
      default: UserRole.editor,
    },
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre<UserDocument>('save', function save(next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  });
});

/**
 * Compare password method.
 */
userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>(
  'User',
  userSchema
);
