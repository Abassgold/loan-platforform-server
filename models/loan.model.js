import mongoose from 'mongoose';

const LoanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true, lowercase: true },
    businessName: { type: String, required: true, lowercase: true },
    loanAmount: { type: Number, required: true },
    fundingReason:  {type: String, required: true},
    cellPhone:  {type: String, required: true,},
    duration: { type: Number, required: true }, // Loan duration in months
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'repaid'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
},
    { timestamps: true }
);

const Loan = mongoose.model('Loan', LoanSchema);
export default Loan;
