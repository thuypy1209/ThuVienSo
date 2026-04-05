var express = require("express");
var router = express.Router();
let bcrypt = require('bcrypt')

let userModel = require("../schemas/users");
let roleModel = require('../schemas/roles');

let { validatedResult, CreateAnUserValidator, ModifyAnUserValidator } = require('../utils/validator')
let userController = require('../controllers/users')
let {CheckLogin} = require('../utils/authHandler')


let multer = require('multer')

let upload = multer({ dest: 'uploads/' });
let csv = require('csv-parser');
let fs = require('fs');
let crypto = require('crypto');
let nodemailer = require('nodemailer');

router.get("/", CheckLogin, async function (req, res, next) {
  let users = await userController.GetAllUser()
  res.send(users);
});

router.get("/:id", async function (req, res, next) {
  let result = await userController.GetUserById(
    req.params.id
  )
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({ message: "id not found" })
  }
});

router.post("/", CreateAnUserValidator, validatedResult, async function (req, res, next) {
  try {
    let user = await userController.CreateAnUser(
      req.body.username, req.body.password,
      req.body.email, req.body.role
    )
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", ModifyAnUserValidator, validatedResult, async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate
      (id, req.body, { new: true });

    if (!updatedItem) return res.status(404).send({ message: "id not found" });

    let populated = await userModel
      .findById(updatedItem._id)
    res.send(populated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send({ message: "id not found" });
    }
    res.send(updatedItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
router.post('/import', upload.single('file'), async function (req, res) {
    try {
        // Kiểm tra xem có file được gửi lên không
        if (!req.file) {
            return res.status(400).send({ message: "Vui lòng đính kèm file CSV vào trường 'file'" });
        }

        // Gọi hàm ImportUsers truyền vào đường dẫn file tạm
        let result = await userController.ImportUsers(req.file.path);
        
        res.status(200).send({
            message: "Quá trình import hoàn tất",
            data: result
        });
    } catch (err) {
        res.status(500).send({ message: "Lỗi Server: " + err.message });
    }
});

module.exports = router;