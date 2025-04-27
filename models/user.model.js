import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true, },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: {
    type: String,
    required: true,
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
},
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = this.password.replace(/\s+/g, "");
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    throw new Error(error.message)
  }
});
userSchema.methods.comparePassword = async function (plainPassword) {
  if (!this.password) {
    throw new Error('Password not found in the user document');
  }
  return bcrypt.compare(plainPassword, this.password);
};
const User = mongoose.model('User', userSchema);
export default User;
