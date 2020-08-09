const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const borrowSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    items: [{
        _id: false,
        p_id: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            trim: true
        },
        name_p: {
            type: String,
            trim: true
        },
        qty: {
            type: Number,
            default: 1
        }
    }],
    status:{
        type:String,
        default:0
    }

}, {
    timestamps: true,
    collection: 'borrows'
})


const Borrow = mongoose.model('borrow', borrowSchema);
module.exports = Borrow;