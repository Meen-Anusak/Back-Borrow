const Product = require('../models/product_model');
const config = require('../configs/evn');

exports.getProduct = async(req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

exports.addProduct = async(req, res, next) => {
    try {
        const { p_Id, name_p, stock, detail } = req.body;

        if (req.file !== undefined) {
            var imageName = req.file.filename;
        } else {
            var imageName = 'no-image.png'
        }

        let product = new Product();
        product.p_Id = p_Id;
        product.name_p = name_p;
        product.stock = stock;
        product.detail = detail;
        product.image = `${config.IMAGE_URL}${imageName}` || 'no-image.png'

        await product.save()

        res.status(201).json({
            message: 'บันทึกข้อมูลเรียบร้อย'
        })

    } catch (error) {
        next(error)
    }
}