const express = require('express');
const mongoose = require('mongoose');
const Trade = require('../models/trade.model');
const { authenticate } = require('../middleware/authenticate.middleware');

const router = express.Router();

router.get('/trade/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const trade = await Trade.findById(id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: null,
        message: "Trade with this ID does not exist",
        response: null,
      })
    }

    return res.status(200).json({
      success: true,
      error: null, 
      response: trade,
      message: null,
    }) 
  }catch(error){
    return res.status(500).json({ success: false, error: error }) 
  }
});

router.get('/trades', authenticate, async (req, res) => { 
  try{
    console.log(req.user.id);

    const trades = await Trade.find({userId: req.user.id});

    console.log(trades);

    return res.status(200).json({
      success: true,
      response: trades,
      error: null,
      message: null,
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({ success: false, error: error });   
  }
});

router.post('/trades/', authenticate, async (req, res) => {
  try{
    const {
      pair,
      direction,
      positionSize,
      entryPrice,
      exitPrice,
      stopLoss,
      takeProfit,
      pnl,
      rr,
      reason,
      emotions,
      mistakes,
      screenshots,
      tradeRate,
      openedAt,
      closedAt
    } = req.body;

    console.log(req.body);

    const trade = new Trade({userId: req.user.id, pair, direction, positionSize, entryPrice, exitPrice, stopLoss, takeProfit, pnl, rr, reason, emotions, mistakes, screenshots, tradeRate, openedAt, closedAt});

    console.log(trade);

    await trade.save();

    return res.status(201).json({
      success: true, 
      error: null,
      message: null,
      response: trade,
    })
  }catch(error){

    console.error("КРИТИЧНА ПОМИЛКА БЕКЕНДУ:", error);

    return res.status(500).json({ success: false, error: error }) 

  }
});

router.delete('/trades/:id', authenticate, async (req, res) => {
  try{
    const { id } = req.params;

    const trade = await Trade.findById(id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: null,
        message: "Trade with this ID does not exist",
        response: null,
      })
    }

    if (trade.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: null,
        message: "You are not allowed to delete this trade",
        response: null,
      })
    }

    await trade.deleteOne();

    return res.status(200).json({
      success: true,
      error: null,
      message: null,
      response: trade,
    })
  }catch(error){
    console.error(error);
    return res.status(500).json({ success: false, error: error.message })
  }
});

/*

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
      required: true,
    },

    takeProfit: {
      type: Number,
      required: true
    },

    pnl: {
      type: Number,
      required: true
    },

    rr: {
      type: Number,
      required: true
    },

    reason: {
      type: String,
      required: true,
      trim: true
    },

    emotions: {
      type: String,
      required: true,
      trim: true
    },

    mistakes: {
      type: String,
      required: true,
      trim: true
    },

    screenshots: {
      type: [String],
    },

    tradeRate: {
      type: Number,
      min: 1,
      max: 12,
      required: true,
    },

    openedAt: {
      type: Date,
      required: true,
    },

    closedAt: {
      type: Date
    }
  },
  {timestamps: true}
);

const Trade = mongoose.model('Trade', TradeSchema);

module.exports = Trade

*/

module.exports = router;