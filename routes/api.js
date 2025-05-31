"use strict";
const crypto = require("crypto");
const axios = require("axios");
const Like = require("../model/like.js");
module.exports = function (app) {
  
  async function getStockInfo(stockSymbol) {
    const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockSymbol}/quote`;
    try {
      const response = await axios.get(url);
      return {stock: stockSymbol, price:response.data.latestPrice};
    } catch (error) {
      console.error("Error fetching stock info:", error);
      return error;
    }
  }

  async function likeHandler(stock,ip,like){
    const hashedIp = crypto.createHash("md5").update(ip).digest("hex");
    if(! await Like.findOne({stock, hashedIp}) &&like) {    
        await Like.create({stock, hashedIp})
  }
    try {
      const likes = await Like.find({ stock });
      return likes.length || 0;
    } catch (error) {
      console.error("Error fetching likes:", error);
      return error;
    }    
}
  app.get("/api/stock-prices", async (req, res) => {

    let { stock, like } = req.query;
    const ip = req.ip;
    if (Array.isArray(stock)) {
      stock = stock.map(s => s.toUpperCase());
    } else if (typeof stock === 'string') {
      stock = stock.toUpperCase();
    }
    if (!stock) {
      return res.status(400).json({ error: "Stock symbol is required" });
    }

    if(Array.isArray(stock)) {
      if( stock.length > 2) {
        return res.status(400).json({ error: "You can only request up to 2 stocks at a time" });
      }
      let data = [];
      let likes = [];
      for (let element of stock) {
        data.push(await getStockInfo(element));
        likes.push(await likeHandler(element, ip,like));
      }
      data[0].rel_likes = likes[0] - likes[1];
      data[1].rel_likes = likes[1] - likes[0];
      return res.json({stockData:data});
    }
    else {
      const stockData = await getStockInfo(stock);
        stockData.likes = await likeHandler(stock, ip,like);
      return res.json({stockData:{stockData}});
    }
  })
};
