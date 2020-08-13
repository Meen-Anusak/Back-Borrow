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

        const {_id } = req.body;
        const user_id = req.user;
        let data = { p_id: _id }

        const checkuser = await Borrow.findOne({ user: user_id }); //ค้าหา user
        const borrow = await Borrow.find()
        console.log(checkuser);
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
        } else  {
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
        const item = await Borrow.findOne({ user: req.user,status:"0" }).populate('user', '-password -_id').populate({
            path: 'items',
            populate: { path: 'p_id' },
        });
        const product_id = item._id
        let data_items = item.items
        let num = await data_items.map((s)=>{
            return s.qty
        })
       let total =  await num.reduce((sum,number)=>{
            return sum + number
        },0)
        res.status(200).json({data:{data_items,total,product_id}})

    } catch (error) {
        next(error)
    }
}

exports.RemoveItem = async(req, res, next) => {

    try {

        const { _id } = req.body;
        const user_id = req.user;

        const checkuser = await Borrow.findOne({ user: user_id }); //ค้าหา user

        if (checkuser != null) {

            let checkItem = await Borrow.findOne({ user: user_id }, { items: { $elemMatch: { p_id: _id } } });

            let [dataI] = checkItem.items

            dataI.qty--
                await checkItem.save();
            res.status(201).json({ message: 'อุปกรณ์ -1' })

        } else {
            const error = new Error('unauthorized');
            error.status_code = 401
            throw error;
        }

    } catch (error) {
        next(error)
    }

}

exports.DeleteItem = async(req, res, next) => {
    const {_id } = req.body;
    const user_id = req.user;
    
    const checkuser = await Borrow.findOne({user:user_id});

    if(checkuser != null){
        await Borrow.updateOne({$pull:{items:{p_id:_id}}})
        res.status(200).json({message:'ลบอุปกรณ์เรียบร้อย'})
    }
}

exports.DeleteList = async(req,res,next)=>{
    try {
        const user_id = req.user;
        await Borrow.findOneAndDelete({ user: user_id }); //ค้าหา user
        res.status(200).json({message:'ลบรายการเรียบร้อย'})
    } catch (error) {
        next(error)
    }
}

exports.borrow = async(req,res,next)=>{
    try {
        const {productId} = req.body;
        const item = await Borrow.findOne({ _id: productId }).populate('user', '-password -_id').populate({
            path: 'items',
            populate: { path: 'p_id' },
        });
        item.status = 1;
        await item.save();
        res.status(200).json({message:'ทำการยืม/รออนุมัติ'})
    } catch (error) {
        next(error)
    }
}
exports.waitBorrow = async(req,res,next)=>{
    try {
        const item = await Borrow.findOne({ user: req.user,status:"1" }).populate('user', '-password -_id').populate({
            path: 'items',
            populate: { path: 'p_id' },
        });
        const product_id = item._id
        const user = item.user;
        let data_items = item.items
        let num = await data_items.map((s)=>{
            return s.qty
        })
       let total =  await num.reduce((sum,number)=>{
            return sum + number
        },0)
        res.status(200).json({data:{data_items,total,product_id,user}})
    } catch (error) {
        next(error)
    }
}
