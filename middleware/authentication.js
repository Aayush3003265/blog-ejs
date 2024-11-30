const { validateToken } = require("../services/authentication");
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    console.log("Checking for authentication cookie...");
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      console.log("No token cookie, continuing...");
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
      console.log("Token validated, user payload set.");
    } catch (error) {
      console.error("Error validating token:", error);
    }
    next();
  };
}
module.exports = {
  checkForAuthenticationCookie,
};

// 3736,3677 == 60
