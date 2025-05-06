import express from "express";
import {  Authentication, SignIn, SignUp, updateName, updatePassword } from "../controller/User.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const userRouter = express.Router();
userRouter.post('/signin', SignIn )
userRouter.post('/signup', SignUp)
userRouter.get('/authentication', authMiddleware, Authentication)
userRouter.patch('/updatename', authMiddleware, updateName)
userRouter.patch('/updatepassword', authMiddleware, updatePassword)


export default userRouter;