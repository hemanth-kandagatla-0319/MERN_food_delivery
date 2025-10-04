const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Create Firm
const addFirm = async (req, res) => {
    const { firmname, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : null; // Handle file upload
    const vendorId = req.vendorId; // Assuming vendorId is set in req by authentication middleware  
    console.log("Vendor ID from token:", vendorId);
    
    try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        const newFirm = new Firm({ firmname, area, category, region, offer, image, vendor: vendorId });
        await newFirm.save();
        vendor.Firm.push(newFirm); 
        await vendor.save();
        res.status(201).json({ message: "Firm created successfully", firm: newFirm });
    } catch (error) {
        console.error("Error creating firm:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteFirmById = async (req, res) => {
    const { id } = req.params;  
    try {
        const deletedFirm = await Firm.findByIdAndDelete(id);
        if (!deletedFirm) {
            return res.status(404).json({ message: "Firm not found" });
        }
        res.status(200).json({ message: "Firm deleted successfully" });
    } catch (error) {
        console.error("Error deleting firm:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById };
