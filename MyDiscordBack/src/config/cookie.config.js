const generateCookie = (token, res, expire = 1000 * 60 * 60 * 24) => {
    return res.cookie('token', token, {
        httpOnly: true,
        maxAge: expire,
        signed: true,
        secure: true
    });
}

module.exports = {
    generateCookie
}