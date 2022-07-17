const User = require('../models/Users');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    try {
        // let user = await User.create(req.body);
        console.log(req.body);
        // if (!user) {
        //     return res.status(204).json({ status: 'error', message: 'no content' });
        // }
        res.json({ status: 'success', message: 'Successfully registered' });
    } catch (err) {
        res.status(504).json({ status: 'error', message: err });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        // if user is found make sure the email and password match
        if (!user) {
            return res.status(400).json({ status: 'error', message: "User with that email does not exist. Please register" });
        } else if (!user.authenticate(password)) {    // create authenticate method in user model
            return res.status(401).json({ status: 'error', message: "Email and password does not match" });
        }
        // console.log(user._id);
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // if anyone want user can login from one device at a time then uncomment below line of code
        // await User.findByIdAndUpdate({ _id: user._id }, { $set: { token: token } });

        // persist the token as 'token' in cookie with expiry date
        res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
        // return response with user and token to frontend client
        return res.json({ status: 'success', message: '', user: { token, _id: user._id, email: user.email, name: user.name, role: user.role } });

    } catch (err) {
        // console.log(err);
        res.status(401).json({ status: 'error', message: err });
    }

};

const logout = async (req, res) => {
    res.clearCookie("token");
    res.json({ status: 'success', message: "Logout success" });
};

const requireLogin = async (req, res, next) => {
    try {
        let token = '';
        if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
            token = req.headers.authorization.split(" ")[1];
        }
        // console.log(token);
        let decode = jwt.verify(token, process.env.JWT_SECRET);
        let validateUser = await User.findById({ _id: decode._id }).populate([{path:'role', select: {name:1}}]);
        // console.log(validateUser);
        if (validateUser) {
            req.auth = decode;
            req.auth.role = validateUser.role ? validateUser.role : null;
            return next();
        }
        throw "You are not authorised to access the resource."
    } catch (err) {
        // console.log(err);
        res.status(401).json({ status: 'error', message: err });
    }
}

const isAuth = async (req, res, next) => {
    try {
        let user = req.profile && req.auth && req.profile._id == req.auth._id;
        if (!user) {
            return res.status(403).json({ status: 'error', message: "Access denied" });
        }
        next();
    } catch (err) {
        // console.log(err);
        res.status(504).json({ status: 'error', message: err });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.auth.role && req.auth.role.name === 'admin') {
            return next();
        }
        res.status(403).json({ status: 'error', message: "Admin resourse! Access denied" });
    } catch (err) {
        console.log(err)
        res.status(504).json({ status: 'error', message: err });;
    }
};


module.exports = {
    register,
    login,
    requireLogin,
    isAuth,
    isAdmin,
    logout
}