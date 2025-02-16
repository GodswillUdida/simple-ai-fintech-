import { model, Schema } from "mongoose";


const UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
});

const User = model('User', UserSchema);

export default User;