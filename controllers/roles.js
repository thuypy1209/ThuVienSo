let roleModel = require("../schemas/roles");

module.exports = {
    GetAllRoles: async function (req, res) {
        try {
            let roles = await roleModel.find({ isDeleted: false });
            res.send(roles);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    GetRoleById: async function (req, res) {
        try {
            let result = await roleModel.find({ _id: req.params.id, isDeleted: false });
            if (result.length > 0) {
                res.send(result[0]); // Nên trả về object thay vì mảng chứa 1 phần tử
            } else {
                res.status(404).send({ message: "Role không tồn tại" });
            }
        } catch (error) {
            res.status(404).send({ message: "Id không hợp lệ" });
        }
    },
    CreateRole: async function (req, res) {
        try {
            let newItem = new roleModel({
                name: req.body.name,
                description: req.body.description
            });
            await newItem.save();
            res.status(201).send(newItem);
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    },
    UpdateRole: async function (req, res) {
        try {
            let id = req.params.id;
            let updatedItem = await roleModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedItem) {
                return res.status(404).send({ message: "Role không tồn tại" });
            }
            res.send(updatedItem);
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    },
    DeleteRole: async function (req, res) {
        try {
            let id = req.params.id;
            let updatedItem = await roleModel.findByIdAndUpdate(
                id,
                { isDeleted: true },
                { new: true }
            );
            if (!updatedItem) {
                return res.status(404).send({ message: "Role không tồn tại" });
            }
            res.send(updatedItem);
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }
}