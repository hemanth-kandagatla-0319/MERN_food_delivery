const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true,
    },
    bestseller: {
        type: String,
        default: "false",
    },
    category: {
        type: [
            {
                type: String,
                enum: ['veg', 'non-veg', 'both'],
            }
        ],
        
    },
    description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String
        },
        firm:[ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Firm",
            required: true,
        }
    ]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
