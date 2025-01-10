import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Crypto from "../models/cryptoModel.js";

// Controller to get statistics of a specific cryptocurrency
export const getStats = catchAsync(async (req, res, next) => {
  const coin = req.query.coin;
  console.log(`Requested coin: ${coin}`);

  // Check if coin query parameter is provided
  if (!coin) {
    return next(new AppError("Please provide a coin", 400));
  }

  // Find the latest entry for the specified coin
  const result = await Crypto.findOne({ id: coin }).sort({ createdAt: -1 });

  // If coin not found, return an error
  if (!result) {
    return next(new AppError("Coin not found", 404));
  }

  console.log(`Coin data retrieved: ${result}`);

  // Send the coin statistics as response
  res.send({
    price: result.current_price,
    marketCap: result.market_cap,
    '"24hChange"': result.price_change_24h,
  });
});
