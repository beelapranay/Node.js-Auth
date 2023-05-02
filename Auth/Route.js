const express = require("express")
const router = express.Router()
const { register, login, update, deleteUser } = require('./Auth')
const { adminAuth } = require('../Middleware/AuthV')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/update').put(adminAuth, update)
router.route('/delete').delete(adminAuth, deleteUser)

module.exports = router