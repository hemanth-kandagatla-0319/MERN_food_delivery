const Vendor = require("../models/Vendor");
const Firm = require("../models/Firm");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const secret = process.env.SECRET_KEY;

// Vendor Registration
const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
 
  try {
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({ username, email, password: hashedPassword });
    await newVendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
      console.error("Error registering vendor:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingVendor = await Vendor.findOne({ email });
    if (!existingVendor || !(await bcrypt.compare(password, existingVendor.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: existingVendor._id }, secret, { expiresIn: "1h" });
    res.status(200).json({ success: "Login Successful", token });
  } catch (error) {
    console.error("Error logging in vendor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('Firm').exec();
    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVendorById = async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findById(id).populate('Firm').exec();
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };