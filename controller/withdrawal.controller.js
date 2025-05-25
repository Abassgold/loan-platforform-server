import uploadImage from "../middleware/cloudinary.js";
import Loan from "../models/loan.model.js";
import Withdrawal from "../models/withdrawal.model.js";

// Request a withdrawal

export const createWithdrawal = async (req, res) => {
  try {
    const { bankName, accountName, accountNumber, amount, identification } = req.body;
console.log('resul');

    const checkLoan = Loan.findOne({ user: req.user.id })
    if (!checkLoan) {
      return res.status(200).json({
        success: false,
        msg: 'No active loan found for this user.',
      });
    }
    if (checkLoan && checkLoan.status !== 'approved') {
      return res.status(200).json({
        success: false,
        msg: 'Your loan request has not been approved yet 🚫',
      });
    }
    const file = await uploadImage(identification)
    const withdrawal = new Withdrawal({
      bankName,
      accountName,
      accountNumber,
      amount,
      identification: file
    });

    await withdrawal.save();
    res.status(201).json({ success: true, msg: 'Withdrawal request submitted successfully ✅', withdrawal });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'Error processing withdrawal request', error: err.message });
  }
};

export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 });
    res.status(200).json(withdrawals);
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching withdrawals', error: err.message });
  }
};

// Get a single withdrawal by ID
export const getWithdrawalById = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(200).json({ message: 'Withdrawal request not found' });
    }
    res.status(200).json(withdrawal);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching withdrawal request', error: err.message });
  }
};

// Update withdrawal status
export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(200).json({ success: false, msg: 'Invalid status' });
    }
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!withdrawal) {
      return res.status(200).json({ success: false, msg: 'Withdrawal request not found' });
    }
    res.status(200).json({ success: true, msg: 'Withdrawal status updated successfully', withdrawal });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error updating withdrawal status', error: err.message });
  }
};

// Delete a withdrawal request
export const deleteWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findByIdAndDelete(req.params.id);
    if (!withdrawal) {
      return res.status(200).json({ success: false, msg: 'Withdrawal request not found' });
    }
    res.status(200).json({ success: true, msg: 'Withdrawal request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Error deleting withdrawal request', error: error.message });
  }
};
