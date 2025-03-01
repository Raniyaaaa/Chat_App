const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sequelize = require('../utils/database');

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