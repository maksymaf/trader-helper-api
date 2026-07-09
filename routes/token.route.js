const express = require('express');
const jwt = require('jsonwebtoken');
const Token = require('../models/token.model');

const router = express.Router();

router.get('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ // Змінено на 401
        success: false,
        message: "No refresh token provided",
      });
    }

    const tokenInDb = await Token.findOne({ refreshToken });
    if (!tokenInDb) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (jwtError) {
      await Token.deleteOne({ refreshToken });
      res.clearCookie('refreshToken');
      return res.status(401).json({ success: false, message: "Refresh token expired or invalid" });
    }

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

    return res.status(200).json({
      success: true,
      response: { accessToken }, 
      message: "Token refreshed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
