import mongoose from "mongoose";
const WithdrawalSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  accountName: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10,}$/.test(v); 
      },
      message: 'Account number must be at least 10 digits long',
    },
  },
  amount: {
    type: Number,
    required: true,
    min: [5000, 'Minimum withdrawal amount is $5000'],
  },
  
  identificationFront: {
    type: String,
    required: true,
  },
  identificationBack: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);
export default Withdrawal;