const Role = require('../models/Role');

const create = async (req, res) => {
    try {
        let role = await Role.create(req.body);
        // console.log(response);
        if (!role) {
            return res.status(204).json({ status: 'error', message: 'no content' });
        }
        res.json({ status: 'success', message: '', role: role });
    } catch (err) {
        res.status(504).json({ status: 'error', message: err });
    }
}

const list = async (req, res) => {
    try {
        let roles = await Role.find();
        if (roles.length === 0) {
            return res.status(204).json({ status: 'error', message: 'no content' });
        }
        res.json({ status: 'success', message: '', roles: roles });
    } catch (err) {
        res.status(504).json({ status: 'error', message: err });
    }
}

const roleById = async (req, res) => {
    try {
        let roleId = req.params.roleId;
        let role = await Role.find({ _id: roleId });
        if (!role) {
            return res.status(204).json({ status: 'error', message: 'no content' });
        }
        res.json({ status: 'success', message: '', role: role });
    } catch (err) {
        res.status(504).json({ status: 'error', message: err });
    }
}

const modify = async (req, res) => {
    try {
        let roleId = req.params.roleId;
        let role = await Role.findOneAndUpdate({ _id: roleId }, { $set: req.body }, { new: true });
        // console.log(role);
        if (!role) {
            return res.status(204).json({ status: 'error', message: 'no content' });
        }
        res.json({ status: 'success', message: '', role: role });
    } catch (err) {
        res.status(504).json({ status: 'error', message: err });
    }
}

const remove = async (req, res) => {
    try {
        let roleId = req.params.roleId;
        let role = await Role.findByIdAndRemove({ _id: roleId });
        if (!role) {
            return res.status(204).json({ status: 'error', message: 'no content' });
        }
        res.json({ status: 'success', message: 'Delete the role successfully' });
    } catch (err) {
        res.status(504).json({ status: 'error', message: err });
    }
}

module.exports = {
    create,
    list,
    roleById,
    modify,
    remove
}