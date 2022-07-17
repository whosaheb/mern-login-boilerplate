const Role = require('../models/Role');
const User = require('../models/Users');

const dataInserter = async () => {
    try {
        let role = await Role.find({ name: 'admin' });
        if (role.length == 0) {
            let roleResult = await Role.create({ name: 'admin' })
            await User.create({
                name: "Admin",
                email: "admin@admin.com",
                password: "12345",
                role: roleResult._id
            })
        }
    } catch (err) {
        console.log(err);
    }
}

dataInserter();