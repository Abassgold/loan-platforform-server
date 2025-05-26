import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
export const SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(200).json({
            success: false,
            msg: 'User already exists'
        });
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({
            success: true,
            msg: 'User registered successfully'
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            success: false,
            msg: 'Internal server error'
        });
    }
}

export const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const tokens = req.cookies.authToken
        if (!email || !password) {
            return res.status(200).json({ success: false, msg: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) return res.status(200).json({
            success: false,
            msg: 'Invalid credentials'
        });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(200).json({
            success: false,
            msg: 'Invalid credentials'
        });
        const option = {
            id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        const token = jwt.sign(option, process.env.JWT_SECRET);
        res.cookie('authToken', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24, 
        });

        res.status(200).json({
            success: true,
            msg: 'Login successful',
            user: {
                id: user._id,
                updatedAt: user.updatedAt,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server error' })
    }
}
export const Authentication = (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            msg: "User authenticated successfully",
            user: req.user,
        });
    } else {
        res.status(401).json({ msg: "User not authenticated" });
    }
};
export const updateName = async (req, res) => {
    const { fullName } = req.body;
    const userId = req?.user?.id;

    if (!fullName) {
        return res.status(200).json({ success: false, msg: "Fullname is required" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { name: fullName },
            { new: true }
        );

        if (!user) {
            return res.status(200).json({ success: false, msg: "Update failed ❌" });
        }
        const option = {
            id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        const token = jwt.sign(option, process.env.JWT_SECRET);
        const isProduction = process.env.NODE_ENV === "production";
       res.cookie('authToken', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'Lax',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24, 
        });

        res.status(200).json({ success: true, msg: "Update successful ✅", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findOne({ _id: req?.user.id });

        if (!user) {
            return res.status(200).json({ success: false, msg: 'User not found' });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(200).json({ success: false, msg: 'Incorrect current password' });
        }
        user.password = newPassword;

        await user.save();
        const userData = await User.findById(user._id).select('-password -__v');
        res.status(200).json({
            success: true,
            msg: 'Password changed successfully 🔐',
            user: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Server error. Try again later.' });
    }
};

export const SignOut = (req, res) => {
    res.clearCookie('token');
    res.json({ succes: true, msg: 'Logout successful' });
}