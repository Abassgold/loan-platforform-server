import express from 'express';
import { createWithdrawal, deleteWithdrawal, getAllWithdrawals, getWithdrawalById, updateWithdrawalStatus } from '../controller/withdrawal.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const withdrawalRouter = express.Router();
 withdrawalRouter.post('/', authMiddleware, createWithdrawal)
withdrawalRouter.get('/', getAllWithdrawals);
withdrawalRouter.get('/:id', getWithdrawalById);
withdrawalRouter.patch('/:id', updateWithdrawalStatus);
withdrawalRouter.delete('/:id', deleteWithdrawal);

export default withdrawalRouter;
