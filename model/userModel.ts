import { model, Schema } from "mongoose";
// import argon2 from "argon2";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  // comparePassword: (candidatePassword: string) => Promise<boolean>;
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

// , {
    //   type: argon2.argon2id,
    //   memoryCost: 2 ** 16, 
    //   timeCost: 3,
    //   parallelism: 2, 
    // });

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     this.password = await argon2.hash(this.password);
//     next();
//   } catch (error:any) {
//     next(error.message);
//   }
// });

// : Promise<boolean>

// UserSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ) {
//   return await argon2.verify(this.password, candidatePassword);
// };

// UserSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   return user;
// };

const User = model<IUser>('User', UserSchema);
export default User;