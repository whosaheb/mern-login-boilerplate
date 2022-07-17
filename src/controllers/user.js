const User = require("../models/Users");
const { errorHandler } = require("../helper/dbErrorHandler");

const userById = async (req, res, next, id) => {
    try {
        let user = await User.findById(id).exec();
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'User not found' });
        }
        req.profile = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(504).json({ status: 'error', message: err });
    }
};

const read = (req, res) => {
    let user = req.profile;
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json({ status: 'success', message: '', user });
};

const userList = async (req, res) => {
    try {
        let users = await User.find({}, { hashed_password: 0, salt: 0 });
        if (users.length == 0) {
            return res.status(204).json({ status: 'success', message: 'No users' });
        }
        res.json({ status: 'success', message: '', users: users });
    } catch (err) {
        console.log(err);
        res.status(504).json({ status: 'error', message: err });
    }
}

const update = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            throw "reqest body can not be null";
        }
        let user = req.profile; //define the user object

        //modify user object if there is any new data
        if (req.body.name) user.name = req.body.name;
        if (req.body.role) user.role = req.body.role;
        if (req.body.password && req.body.newPassword) {
            if (user.authenticate(req.body.password)) {
                user.password = req.body.newPassword;
            } else {
                return res.status(400).json({ status: 'error', message: 'Wrong password' })
            }
        } else if (req.body.password && !req.body.newPassword) {
            return res.status(400).json({ status: 'error', message: 'please provide your password and new password' })
        }

        user = await user.save() //save the updated user into db
        user.hashed_password = undefined; // undefined unnessesory value for client
        user.salt = undefined;
        res.json({ status: 'success', message: '', user });

    } catch (err) {
        // console.log(err);
        res.status(500).json({ status: 'error', message: err });
    }
};

const remove = async (req, res) => {
    try {
        let user = await User.findByIdAndRemove({ _id: req.profile._id });
        if(!user) return res.status(400).json({ status: 'error', message: "Unable to delete user" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: err });
    }
}

module.exports = {
    userById,
    read,
    update,
    userList,
    remove
}
