const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const config = require('../configs/evn');

exports.addUser = async(req, res, next) => {
    try {
        const { studentID, fname, lname, password, role } = req.body;

        if (req.file !== undefined) {
            var imageName = req.file.filename;
        } else {
            var imageName = 'no-image.png'
        }

        const checkStudentID = await User.findOne({ studentID: studentID })

        if (checkStudentID) {
            const error = new Error('รหัสนักศึกษานี้มีผู้ใช้งานแล้ว');
            error.statusCode = 404;
            throw error;
        }
        let user = new User();
        user.studentID = studentID;
        user.fname = fname;
        user.lname = lname;
        user.password = await user.encryptPassword(password);
        user.role = role;
        user.image = `${config.IMAGE_URL}${imageName}` || 'no-image.png'

        await user.save();

        res.status(201).json({
            message: 'บันทึกข้อมูลเรียบร้อย'
        })

    } catch (error) {
        next(error)
    }
}

exports.login = async(req, res, next) => {
    try {
        const { studentID, password } = req.body;

        const checkUser = await User.findOne({ studentID: studentID });
        if (!checkUser) {
            const error = new Error('ไม่พบผู้ใช้ในระบบ')
            error.statusCode = 404
            throw error;
        }
        const checkPassword = await checkUser.checkPassword(password, checkUser.password);
        if (!checkPassword) {
            const error = new Error('รหัสผ่านไม่ถูกต้อง')
            error.statusCode = 401
            throw error;
        }
        const token = await jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
        }, config.JWT_SECRET, { expiresIn: '1day' })
        const expiresIn = await jwt.decode(token);

        res.status(200).json({
            message: 'เข้าสู่ระบบสำเร็จ',
            access_token: token,
            exp: expiresIn.exp,
            token_type: 'Bearer',
            role: checkUser.role,
        })

    } catch (error) {
        next(error)
    }
}

exports.getProfile = async(req, res, next) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        next(error)
    }
}

exports.getUsers = async(req, res, next) => {
    try {
        const users = await User.find().populate('borrow');
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async(req, res, next) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (deleteUser) {
            res.status(200).json({ message: 'ลบข้อมูลเรียบร้อย' })
        }
    } catch (error) {
        next(error)
    }
}

exports.changePass = async(req, res, next) => {
    try {
        const { old_pass, new_pass } = req.body;

        const user = await User.findById(req.user.id)

        const checkpass = await user.checkPassword(old_pass, user.password);
        if (!checkpass) {
            const error = new Error('รหัสผ่านเดิมไม่ถูกต้อง')
            error.statusCode = 401;
            throw error
        }
        user.password = await user.encryptPassword(new_pass);
        await user.save();

        res.status(201).json({ message: 'เปลียนรหัสผ่านเรียบร้อย' });

    } catch (error) {
        next(error)
    }

}

exports.updateImage = async(req, res, next) => {
    try {
        if (req.file !== undefined) {
            var imageName = req.file.filename;
        } else {
            var imageName = 'no-image.png'
        }
        const user = await User.findById(req.user.id)
        user.image = `${config.IMAGE_URL}${imageName}` || 'no-image.png'


        await user.save()
        res.status(201).json({
            message: 'แก้ไขข้อมูลเรียบร้อย'
        })

    } catch (error) {
        next(error)
    }
}

exports.getUserById = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error('ไม่มีผู้ใช้งานนนี้ในระบบ')
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

exports.updateUser = async(req, res, next) => {
    try {
        const { studentID, fname, lname, role, password } = req.body;

        const user = await User.findByIdAndUpdate(req.params.id);
        if (user) {
            if (req.file !== undefined) {
                var imageName = req.file.filename;

                user.studentID = studentID;
                user.fname = fname;
                user.lname = lname;
                user.role = role;
                user.image = `${config.IMAGE_URL}${imageName}` || 'no-image.png'

            } else {

                user.studentID = studentID;
                user.fname = fname;
                user.lname = lname;
                user.role = role;

            }


            if (password !== '') {
                user.password = await user.encryptPassword(password)
            }

            await user.save();
            res.status(200).json({
                message: 'แก้ไขข้อมูลเรียบร้อย'
            })

        } else {
            const error = new Error('ไม่พบผู้ใช้งานในระบบ');
            error.statusCode = 404;
            throw error;
        }

    } catch (error) {
        next(error)
    }
}