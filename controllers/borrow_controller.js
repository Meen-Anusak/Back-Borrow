const Borrow = require('../models/borrow_model');


exports.getItem = async(req, res, next) => {
    try {
        const item = await Borrow.find().populate('user', '-password -_id').populate({
            path: 'items',
            populate: { path: 'p_id' },
        });

        if (item) {
            res.send(item)
        }
    } catch (error) {
        next(error)
    }
}

exports.addItem = async(req, res, next) => {
    try {

        const { p_id, _id, qty, } = req.body;

        const user_id = req.user;
        let data = { p_id: _id }

        const checkuser = await Borrow.findOne({ user: user_id }); //ค้าหา user


        if (checkuser != null) {

            let checkItem = await Borrow.findOne({ user: user_id }, { items: { $elemMatch: { p_id: _id } } });
            let [dataI] = checkItem.items

            if (dataI == undefined) {
                let item = await Borrow.updateMany({ _id: checkuser._id }, { $push: { items: data } }).exec() //เพิ่มอุปกรณ์
                if (item) {
                    res.json({ message: 'เพิ่มอุปกรณ์' })
                }
            } else {
                dataI.qty++
                    await checkItem.save();
                res.json({ message: 'เพิ่มอุปกรณ์ + 1' })
            }
        } else {
            // สร้างรายการใหม่
            let item = new Borrow();
            item.user = user_id;
            item.items.push(data);
            await item.save()
            res.json({ message: 'สร้างรายการสำเร็จ' })
        }

    } catch (error) {
        next(error)
    }
}

exports.getItemByUser = async(req, res, next) => {
    try {
        const item = await Borrow.findOne({ user: req.user._id }).populate('user', '-password -_id').populate({
            path: 'items',
            populate: { path: 'p_id' },
        });
        let data = item.items
        res.json(data)
    } catch (error) {
        next(error)
    }
}