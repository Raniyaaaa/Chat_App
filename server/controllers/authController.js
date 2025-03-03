const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sequelize = require('../utils/database');


// Signup
exports.signup = async (req, res) => {
  const t = await sequelize.transaction(); 
  try {
    const { username, email, password ,number} = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      { name:username, email, password: hashedPassword ,number},
      { transaction: t }
    );

    await t.commit(); 
    return res.status(201).json({ message: 'User created successfully', user });

  } catch (error) {
    console.log(error.message);
    
    if (t){
      await t.rollback()
    };
    return res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    res.status(200).json({ message: 'Login successful', token ,user});
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ error: error.message });
  }
};

// exports.forgotPassword = async (req, res) => {
//   const baseUrl = req.headers.referer
//   const t = await sequelize.transaction();
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//      const requestId = uuidv4();

//      await ForgotPasswordRequest.create({
//        id: requestId,
//        userId: user.id,
//        isActive: true,
//      },{transaction : t});
 

//     const resetUrl = `${baseUrl}reset-password?requestId=${requestId}&email=${email}`;

//     const mailOptions = {
//       to: user.email,
//       from: process.env.ADMIN_MAIL, 
//       subject: "Password Reset",
//       text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//         Please click on the following link, or paste it into your browser to complete the process:\n\n
//         ${resetUrl}\n\n
//         If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//     };

//     await transporter.sendMail(mailOptions);

//     await t.commit()
//     res.status(200).json({ message: 'Password reset email sent.' });
//   } catch (error) {
//     if(t){
//       await t.rollback()
//     }
    
//     res.status(500).json({ error: error.message });
//   }
// };

// // Reset Password
// exports.resetPassword = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { email, password ,requestId} = req.body;

//     const request = await ForgotPasswordRequest.findOne({
//       where: { id: requestId, isActive: true },
//     });

//     if (!request) {
//       return res.status(404).json({ error: 'Invalid or expired reset link' });
//     }

//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await user.update({ password: hashedPassword } , {transaction : t});

//     await request.update({ isActive: false },{transaction : t});
    
//     await t.commit()
//     res.status(200).json({ message: 'Password reset successful.' });
//   } catch (error) {
//     if(t){
//       await t.rollback()
//     }
//     res.status(500).json({ error: error.message });
//   }
// };