const express = require ('express')

const router = express.Router()
const {getSpecificProduct ,updateProduct , deleteProduct ,getAllProducts , createProduct } = require('../controller/productController')
const { getProductValidator , deleteProductValidator, updateProductValidator , creatProductValidator}= require('../utils/validators/productValidator')


router.route('/')
.post(creatProductValidator, createProduct)
.get(getAllProducts)


router.route('/:id')
.delete(deleteProductValidator,deleteProduct)
.put( updateProductValidator,updateProduct)
.get(getProductValidator,getSpecificProduct)



module.exports = router
