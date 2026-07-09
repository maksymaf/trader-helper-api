const mongoose = require('mongoose');

const TradeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    pair: {
      type: String,
      required: true,
      trim: true,
    },

    direction: {
      type: String,
      required: true,
      enum: ["short", "long"],
      trim: true
    },

    // Скільки активу я купив
    positionSize: {
      type: Number,
      required: true,
    },

    entryPrice: {
      type: Number,
      required: true,
    },

    exitPrice: {
      type: Number,
      required: true,
    },

    stopLoss: {
      type: Number,
    },

    takeProfit: {
      type: Number,
    },

    pnl: {
      type: Number,
    },

    rr: {
      type: Number,
    },

    reason: {
      type: String,
    },

    emotions: {
      type: String,
    },

    mistakes: {
      type: String,
    },

    screenshots: {
      type: [String],
    },

    tradeRate: {
      type: Number,
      min: 1,
      max: 12,
    },

    openedAt: {
      type: Date,
    },

    closedAt: {
      type: Date
    }
  },
  {timestamps: true}
);

const Trade = mongoose.model('Trade', TradeSchema);

module.exports = Trade