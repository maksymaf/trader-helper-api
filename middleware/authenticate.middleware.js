const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try{

    const authHeader = req.headers.authorization;

    if (!authHeader){
      return res.status(401).json({
        success: false,
        error: null,
        message: "No token provided",
        response: null,
      })
    }

    const token = authHeader.split(' ')[1];

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = payload;
    next();

  }catch(error){

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      message: null,
      response: null,
    })
  }
}

module.exports = {
  authenticate
}