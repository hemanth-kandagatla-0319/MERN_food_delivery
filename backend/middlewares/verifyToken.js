const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const secret = process.env.SECRET_KEY;

if (!secret) {
  throw new Error("SECRET_KEY environment variable is not set");
}

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  
  if (!token) return res.status(403).send("A token is required for authentication");

  try {
    const decoded = jwt.verify(token, secret);
    
    let vendorId = decoded.id;
   
    console.log("VendorId:", vendorId);
    
    const vendorFromDb = await Vendor.findById(vendorId);

    
    if (!vendorFromDb) {
      return res.status(404).send("Vendor not found");
    }
    req.vendorId = vendorFromDb._id;

    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyToken;
