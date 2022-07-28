const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');


const register = async (req, res) => {
    try {
        // console.log(req.body);
        let emailPresent = await User.findOne({ email: req.body.email }, { email: 1 });
        //if email not present in the db then allow to register user
        if (!emailPresent) {
            //if user role is not present in body then assign default 'user' role when register 
            if (req.body && !req.body.role) {
                let role = await Role.findOne({ name: 'user' });
                //if 'user' role not created then created it
                if (!role) {
                    role = await Role.create({ name: 'user' })
                }
                // assign the 'user' role id to the body object
                req.body.role = role._id;
            }
            // create the user and send a success message to the client
            await User.create(req.body); 
            // if we want to verify the email, then we should create user status which should be false by default , if email verified then set it to true
            res.json({ status: 'success', message: 'Successfully registered' });
        } else {
            //if email exist then send back the message 'Email already exist'
            res.status(400).json({ status: 'error', message: 'Email already exist' });
        }
    } catch (err) {
        res.status(504).json({ status: 'error', message: err });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email }).populate([{ path: 'role', select: { name: 1 } }]);
        // if user is found make sure the email and password match
        if (!user) {
            return res.status(400).json({ status: 'error', message: "User with that email does not exist. Please register" });
        } else if (!user.authenticate(password)) {    // create authenticate method in user model
            return res.status(401).json({ status: 'error', message: "Email and password does not match" });
        }
        // console.log(user.role.name);
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id, role: user.role.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

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
        if(decode){
            req.auth = decode;
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
        let user = req.profile && req.auth && (req.profile._id == req.auth._id || req.auth.role == 'admin');
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