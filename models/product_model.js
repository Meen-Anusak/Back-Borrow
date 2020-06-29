const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = Schema({
    p_Id: {
        type: String,
        required: true,
        trim: true
    },
    name_p: {
        type: String,
        required: true,
        trim: true
    },
    detail: {
        type: String,
    },
    image: {
        type: String
    },
    category: {
        type: String
    },
    stock: {
        type: Number
    }
}, {
    timestamps: true
})

const Product = mongoose.model('product_cce', productSchema)

module.exports = Product;