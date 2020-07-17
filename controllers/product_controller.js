const Product = require('../models/product_model');
const config = require('../configs/evn');



exports.getProduct = async(req, res, next) => {
    try {
        const { search, page, size } = req.query;
        const options = {
            page: page,
            limit: size,
        };
        if (search != '') {
            const products = await Product.paginate({ $text: { $search: search } }, options);
            const total = products.docs.length;
            // res.send({ data: products, total: total })
            res.status(200).json(products.docs)
        } else {
            const products = await Product.paginate({}, options);
            const total = products.totalDocs;
            // res.send({ data: products, total: total })
            res.status(200).json(products.docs)
        }

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
        product.image = `${config.IMAGEPRODUCT_URL}${imageName}` || 'no-image.png';

        await product.save()

        res.status(201).json({
            message: 'บันทึกข้อมูลเรียบร้อย'
        })

    } catch (error) {
        next(error);
    }
}

exports.getTotal = async(req, res, next) => {
    try {
        const productTotal = await Product.find();
        if (productTotal) {
            res.status(201).json(productTotal.length)
        }
    } catch (error) {
        next(error)
    }
}

exports.getProductById = async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product)
        }
    } catch (error) {
        next(error)
    }
}