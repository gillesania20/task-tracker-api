const logout = (req, res) => {
    res.clearCookie('jwt');
    return res.status(200).json({message: 'logout successful'});
}
module.exports = logout;