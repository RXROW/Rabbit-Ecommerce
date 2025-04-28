const express = require ('express')

const router = express.Router()
const {getSpecificBrand ,updateBrand , deleteBrand ,getAllBrands , createBrand } = require('../controller/brandController')
const { getBrandValidator , deleteBrandValidator, updateBrandValidator , creatBrandValidator}= require('../utils/validators/brandsValidator')


router.route('/')
.post(creatBrandValidator, createBrand)
.get(getAllBrands)


router.route('/:id')
.delete(deleteBrandValidator,deleteBrand)
.put( updateBrandValidator,updateBrand)
.get(getBrandValidator,getSpecificBrand)



module.exports = router

