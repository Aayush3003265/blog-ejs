const { Router } = require('express');
const router = Router();
const User = require('../models/user');

// Signup Page
router.get('/signup', (req, res) => {
  return res.render('signup', { errors: {} }); // Always pass an empty errors object initially
});
router.get('/signin', (req, res) => {
  return res.render('signin', { errors: {} }); // Always pass an empty errors object initially
});
router.get('/logout',(req,res)=>{
  res.clearCookie('token').redirect('/');
})

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user and generate token
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Debugging: Log before sending the response
    console.log("Authentication successful, setting cookie and redirecting...");

    // Set cookie and send response (ensure return to avoid further code execution)
    console.log("Setting cookie and redirecting...");
    res.cookie('token', token);
    console.log("Cookie set, redirecting now...");
    return res.redirect('/');
  } catch (error) {
    console.error("Signin error:", error);

    // Ensure no further response is attempted if headers are already sent
    if (!res.headersSent) {
      return res.render('signin', {
        errors: { message: 'Incorrect Email or Password' },
      });
    }
  }
});





// Signup POST Route
router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body.fullName)
  try {
    await User.create({ fullName, email, password });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
