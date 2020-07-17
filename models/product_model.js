const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var aggregatePaginate = require("mongoose-paginate-v2");

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

productSchema.plugin(aggregatePaginate);
productSchema.index({ name_p: 'text' })

const Product = mongoose.model('product_cce', productSchema);

module.exports = Product;