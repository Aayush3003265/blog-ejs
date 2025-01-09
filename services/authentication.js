const JWT = require("jsonwebtoken");
const secret = "$itachi$kisame$";

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
    }
    const TOKEN = JWT.sign(payload, secret);
    console.log(payload);

    return TOKEN;
}


function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}