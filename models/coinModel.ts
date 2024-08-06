import mongoose from "mongoose";

const coinSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    symbol: {
      type: String,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    current_price: {
      type: Number,
    },
    market_cap: {
      type: Number,
    },
    market_cap_rank: {
      type: Number,
    },
    fully_diluted_valuation: {
      type: Number,
    },
    total_volume: {
      type: Number,
    },
    high_24h: {
      type: Number,
    },
    low_24h: {
      type: Number,
    },
    price_change_24h: {
      type: Number,
    },
    price_change_percentage_24h: {
      type: Number,
    },
    market_cap_change_24h: {
      type: Number,
    },
    market_cap_change_percentage_24h: {
      type: Number,
    },
    circulating_supply: {
      type: Number,
    },
    total_supply: {
      type: Number,
    },
    max_supply: {
      type: Number,
    },
    ath: {
      type: Number,
    },
    ath_change_percentage: {
      type: Number,
    },
    ath_date: {
      type: Date,
    },
    atl: {
      type: Number,
    },
    atl_change_percentage: {
      type: Number,
    },
    atl_date: {
      type: Date,
    },
    roi: {
      type: Object,
    },
    last_updated: {
      type: Date,
    },
    sparkline_in_7d: {
      type: {
        price: [],
      },
    },
    price_change_percentage_1h_in_currency: {
      type: Number,
    },
    price_change_percentage_24h_in_currency: {
      type: Number,
    },
    price_change_percentage_7d_in_currency: {
      type: Number,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

const Coins = mongoose.model("Coin", coinSchema);

export default Coins;
