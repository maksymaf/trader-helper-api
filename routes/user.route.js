const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const Token = require('../models/token.model');

const { authenticate } = require('../middleware/authenticate.middleware');

const router = express.Router();

router.post('/registration', async (req, res) => {
  try{
    const { username, email, password } = req.body;

    if (!username || !email || !password){
      return res.status(400).json({
        success: false,
        error: null,
        message: "Fields user, email and password are required",
        response: null,
      })
    }

    const candidate = await User.findOne({email: email});

    if (candidate){
      return res.status(400).json(
        {
          success: false,
          error: null,
          message: "User with this email already exists",
          response: null,
        }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({email: email, password: hashedPassword, username: username});

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User has been successfuly created",
      error: null,
      response: null,
    })

  }catch(error){
    return res.status(500).json({
      success: false,
      error: error.message,
      response: null,
      message: null,
    });
  }
});

router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;

    if (!email || !password){
      return res.status(400).json({
        success: false,
        error: null,
        message: "Fields email and password are required",
        response: null,
      });
    }

    console.log(email, password);

    const candidate = await User.findOne({email: email});

    console.log(candidate);

    if (!candidate){
      return res.status(404).json({
        success: false,
        error: null,
        message: "User with this email does not exist",
        response: null,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, candidate.password);

    console.log(isPasswordCorrect);

    if (!isPasswordCorrect){
      return res.status(400).json({
        success: false,
        error: null,
        message: "Incorrect password",
        response: null,
      });
    }

    const accessToken = jwt.sign({id: candidate._id}, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign({id: candidate._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

    console.log(accessToken);
    console.log(refreshToken);

    await Token.findOneAndUpdate(
      {user: candidate._id},
      {refreshToken},
      {upsert: true}
    );

    res.cookie('refreshToken', refreshToken,
      {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      }
    );

    return res.status(200).json({      
      success: true,
      message: "Log in successful",
      error: null,
      response: {
        accessToken,
      },
    })

  }catch(error){
    return res.status(500).json({
      success: false,
      error: error.message,
      response: null,
      message: null,
    });
  }
});

router.post('/logout', async (req, res) => {
  try{
    const {refreshToken} = req.cookies;
    await Token.deleteOne({refreshToken});
    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: null,
      error: null,
      response: null,
    })
  }catch(error){
    return res.status(500).json({
      success: false,
      error: error.message,
      response: null,
    })
  }
});

router.get('/me', authenticate, async (req, res) => {
  try{
    const user = await User.findById(req.user.id).select('-password');
    return res.status(200).json({
      success: true,
      message: null,
      error: null,
      response: user,
    });
  }catch(error){
    return res.status(500).json({
      error: error.message,
      success: false,
      message: null,
      response: null,
    })
  }
});

module.exports = router;
