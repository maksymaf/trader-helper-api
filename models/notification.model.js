const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema(
  {
    chatId: {
      type: BigInt,
      unique: true,
      required: true,
      trim: true,
    },

    symbol: {
      type: String,
      required: true,
      trim: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {timestamps: true}
);

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification
