const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {timestamps: true}
);

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;