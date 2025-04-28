const express = require ('express')

const router = express.Router()
const {getSpecificUser ,updateUser , deleteUser ,getAllUsers , createUser } = require('../controller/userController')
const { getUserValidator , deleteUserValidator, updateUserValidator , creatUserValidator}= require('../utils/validators/userValidator')


router.route('/')
.post( creatUserValidator,createUser)
.get(getAllUsers)


router.route('/:id')
.delete(deleteUser)
.put(updateUser)
.get(getSpecificUser)



module.exports = router
