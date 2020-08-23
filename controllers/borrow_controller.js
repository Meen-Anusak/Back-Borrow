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

        const checkBorrow = await Borrow.findOne({user:user_id}).where({status:"0"});
        console.log(checkBorrow)
        if (checkBorrow) {

            let checkItem = await Borrow.findOne({ user: user_id}, { items: { $elemMatch: { p_id: _id } } }).where({status:"0"});
            console.log(checkItem)
            let [dataI] = checkItem.items
            
            if (dataI === undefined) {
                let item = await Borrow.updateMany({ _id: checkItem._id  }, { $push: { items: data } }) //เพิ่มอุปกรณ์
                if (item) {
                    res.json({ message: 'เพิ่มอุปกรณ์' })
                }
            } else {
                dataI.qty++
                    await checkItem.save();
                res.json({ message: 'เพิ่มอุปกรณ์ + 1' })
            }
        } else if(!checkBorrow) {
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
        
        if(!item){
            const error = new Error('ยังไม่มีรายการ')
            error.statusCode = 500
            throw error;
           
        }else{
            const product_id = item._id;
            console.log(item._id)
            let data_items = item.items
            let num = await data_items.map((s)=>{
                return s.qty
            })
           let total =  await num.reduce((sum,number)=>{
                return sum + number
            },0)
            res.status(200).json({data:{data_items,total,product_id}})
        }
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
    const {_id,p_id } = req.body;
    const user_id = req.user;
    
    const checkuser = await Borrow.findOne({user:user_id});

    if(checkuser != null){
        await Borrow.updateOne({_id:p_id},{$pull:{items:{p_id:_id}}})
        res.status(200).json({message:'ลบอุปกรณ์เรียบร้อย'})
    }
}

exports.DeleteList = async(req,res,next)=>{
    try {
       const {_id} = req.body;
        await Borrow.findOneAndDelete({_id : _id}); //ค้าหา user
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
        const checkItem = await Borrow.find({user:req.user,status:"1"})
        console.log(item.status)
        if(!item){
            const error = new Error('ยังไม่มีรายการ')
            error.statusCode = 404;
            throw error; 
        }else if(checkItem.length > 0){
            const error = new Error('ยังมีรายการ รออนุมัติอยู่');
            error.statusCode = 500;
            throw error;
        }else if(checkItem == ''){
            item.status = 1;
            await item.save();
            res.status(200).json({message:'ทำการยืม/รออนุมัติ'})
        }
    } catch (error) {
        next(error)
    }
}
exports.waitBorrow = async(req,res,next)=>{
    try {
        let user = '';

        if(req.body.user_id != undefined ){
            user = req.body.user_id
        }else{
            user = req.user
        }
        const item = await Borrow.findOne({ user: user,status:"1" }).populate('user', '-password -_id').populate({
            path: 'items',
            populate: { path: 'p_id' },
        });
        if(!item){
            const error = new Error('ไม่พบรายการ');
            error.status_code = 404;
            throw error;
        }else{
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
        }
       
    } catch (error) {
        next(error)
    }
}

exports.getwaitBorrow = async(req,res,next)=>{
    try {
        const product = await Borrow.find().where({status:"1"}).populate('user', '-password').populate({
            path: 'items',
            populate: { path: 'p_id' },
        });
        if(product){
            res.json(product)
        }else{
            const error = new Error('ยังไม่มีรายการยืม');
            throw error;
        }
    } catch (error) {
    }
}

exports.Allow = async(req,res,next)=>{
    try {
            const {productId} = req.body;
            const product = await Borrow.findById(productId)
            if(product){
                product.status = '2'
                await product.save()

                res.status(200).json({message:"อนุมัติเรียบร้อย"})
            }
    } catch (error) {
        next(error)
    }
}
