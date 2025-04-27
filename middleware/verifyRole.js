const verifyRole = (role)=>{
    return (req, res, next)=>{
        // if(req.user.role !== role){
        //     return res.status(402).json({msg: 'Access denied'})
        // }
        req.user = role;
        next();
    }
}
export default verifyRole;