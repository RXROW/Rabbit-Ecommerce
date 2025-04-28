const express = require ('express')

const router = express.Router()
const {getSpecificCategory ,updateCategory , deleteCategory ,getAllCategories , createCategory } = require('../controller/categoryController')
const { getCategoryValidator , deleteCategoryValidator, updateCategoryValidator , creatCategoryValidator}= require('../utils/validators/categoryValidator')


router.route('/')
.post(creatCategoryValidator, createCategory)
.get(getAllCategories)

const supCategoryRoute = require('./supCategoryRoute')

router.use('/:categoryId/subcategory',supCategoryRoute )


router.route('/:id')
.delete(deleteCategoryValidator,deleteCategory)
.put( updateCategoryValidator,updateCategory)
.get(getCategoryValidator,getSpecificCategory)



module.exports = router