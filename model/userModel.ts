import { model, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>('User', UserSchema);
export default User;