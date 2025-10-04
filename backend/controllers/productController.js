import Product from "../models/Product.js"
import Firm from "../models/Firm.js"
import multer from "multer";    

// Add Product
export const addProduct = async (req, res) => {
    const { productname, bestseller, category, description, price } = req.body;
    try {
    const image = req.file ? req.file.filename : null; // Handle file upload
    const firmId = req.params.id; // Assuming firmId is set in req by authentication middleware

    if (!firmId) {
        return res.status(400).json({ message: "Firm ID is required" });
    }
    const firm = await Firm.findById(firmId);
    if (!firm) {
        return res.status(404).json({ message: "Firm not found" });
    }

    const newProduct = new Product({
        productname,
        bestseller,
        category,
        description,
        price,
        image,
        firm: firm._id
    });
    const savedProduct = await newProduct.save();
    firm.products.push(savedProduct); // Assuming 'products' is an array in Firm schema
    await firm.save();


    
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductByFirmID = async (req, res) => {
    const { id } = req.params;  
    try {
        const firm = await Firm.findById(id).populate('products').exec();
        if (!firm) {
            return res.status(404).json({ message: "Firm not found" });
        }
        const firmName = firm.firmname;
        const products = await Product.find({ firm: id });
        res.status(200).json({ firmName, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { addProduct, getProductByFirmID, deleteProductById };