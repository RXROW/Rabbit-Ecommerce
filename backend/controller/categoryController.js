const slugify = require ('slugify')
const asyncHandler = require('express-async-handler')
const Category = require ('../models/category')

const ApiError = require('../utils/apiError')
const httpStatusText = require ( '../utils/httpStatusText')


exports.createCategory = asyncHandler ( async (req,res)=>{
    
        const { name } = req.body ; 
        const newCategory = new Category({name , slug : slugify(name)})
        await newCategory.save()
        res.status(201).json({ status : httpStatusText.SUCCESS , data : newCategory , message : "new category added successfuly"})
   
}
);

exports.getAllCategories = asyncHandler(async (req, res)=>{

        const { limit, page } = req.query
        const limitNum = limit * 1 || 10
        const pageNum = page * 1 || 1
        const skip = (pageNum - 1) * limitNum;
    const allCategories =  await Category.find({},{"__v": 0}).limit(limitNum).skip(skip)
    res.status(200).json({ status : httpStatusText.SUCCESS , result : allCategories.length , page ,  data : allCategories   })

});

exports.getSpecificCategory = asyncHandler(async(req,res,next)=>{
    const { id } = req.params ; 
    const SpecificCategory =  await Category.findById(id,{'__v': 0})
      
    if (!SpecificCategory){

        return next(new ApiError('category not found' , 400)) ;
    }
         
         return res.status(200).json({ status : httpStatusText.SUCCESS , data : SpecificCategory })
    
});

exports.deleteCategory = asyncHandler(async(req,res ,next)=>{
     const { id  } = req.params; 
     const deleteCategory = await Category.findByIdAndDelete(id)
     if (!deleteCategory)
        {
            return next( new ApiError(' not found ',400))
   
        }
    return res.status(200).json({ status : httpStatusText.SUCCESS  , message : " deleted successfuly " })
    
});

exports.updateCategory = asyncHandler(async(req,res,next)=>{
    const {  id  } = req.params ;
    const { name }  = req.body ; 
    const updatedCategory = await Category.findByIdAndUpdate(id ,{name , slug : slugify(name)} , {new : true})
    if (!updatedCategory){
        return next( new ApiError(' not found ',400))
   }
   return res.status(200).json({ status : httpStatusText.SUCCESS , data : updatedCategory , message : " updated successfuly " })
   
});



