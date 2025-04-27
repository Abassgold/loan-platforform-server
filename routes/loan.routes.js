import express from "express";
import {   createLoan, Dashboard } from "../controller/loan.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const loanRouter =  express.Router();
loanRouter.get('/dashboard', authMiddleware, Dashboard)
.post('/apply', authMiddleware, createLoan)

export default loanRouter;