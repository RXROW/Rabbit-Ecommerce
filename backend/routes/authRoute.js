const express = require ('express')

const router = express.Router()
const { signup , login} = require('../controller/authController')
const { loginValidator , signupValidator}= require('../utils/validators/authValidator')


router.route('/signup')
.post(signupValidator,signup)
router.route('/login')
.post(loginValidator,login)




module.exports = router
