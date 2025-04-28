const express = require ('express')
const {getAllSubCtegories ,getSpecificSubCtegorie ,addSubCtegorie ,deleteSubCtegorie ,updateSubCtegorie , nestedRouteForAddCategoryIdToParam } = require('../controller/subCategoryController')
const {addSubCtegorievalidator ,getSpecificSubCtegorievalidator , deleteSubCtegorievalidator , updateSubCtegorievalidator} = require ('../utils/validators/subCategoryValidator')

const router = express.Router({mergeParams : true})

router.route('/')
.get(getAllSubCtegories)
.post(nestedRouteForAddCategoryIdToParam, addSubCtegorievalidator, addSubCtegorie)
router.route('/:id')
.get(getSpecificSubCtegorievalidator , getSpecificSubCtegorie)
.delete(deleteSubCtegorievalidator, deleteSubCtegorie)
.put(updateSubCtegorievalidator , updateSubCtegorie)




module.exports = router