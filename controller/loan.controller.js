import Loan from "../models/loan.model.js";
export const Dashboard = async (req, res) => {
    try {
        const loan = await Loan.findOne({ user: req.user.id}).select('-password -updatedAt -__v').populate({
            path: 'user',
            select: '-password -updatedAt -createdAt -__v',
        });
        
        if (!loan) {
            return res.status(200).json({ success: false, msg: 'Loans not found' })
        }
        return res.status(200).json({ success: true, loan })
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
    }
}

export const createLoan = async (req, res) => {
    const {
        fullName,
        businessName,
        loanAmount,
        fundingReason,
        cellPhone,
        duration,
    } = req.body;

    try {
        const existingLoan = await Loan.findOne({
            user: req.user.id,
            status: { $ne: 'repaid' }
        });

        if (existingLoan) {
            return res.status(200).json({
                success: false,
                msg: 'You have an unrepaid loan. Please repay it before applying for a new one.',
            });
        }

        const loan = new Loan({
            user: req.user.id,
            fullName,
            businessName,
            loanAmount,
            fundingReason,
            cellPhone,
            duration,
            status: 'pending',
            createdAt: new Date(),
        });

        const result = await loan.save();

        res.status(201).json({ success: true, msg: 'Your loan application has been submitted.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Server error' });
    }
};
