const asyncHandelar = require('express-async-handler')
const slugify = require('slugify')
const SupCategory = require ('../models/supCategory')
const httpStatusText = require ('../utils/httpStatusText')
const ApiError = require ('../utils/apiError')

exports.getAllSubCtegories = asyncHandelar( async (req ,res)=>{
         
    const { page , limit } = req.query ;
    const numLimit = limit*1 || 10
    const numPage = page * 1 || 1
    const skip = (numPage -1 ) * numLimit ;
     
    let filterObject = {};
    if ( req.params.categoryId)
    { 
        filterObject = { category : req.params.categoryId} 
    }
       const allSubCategory = await SupCategory.find(filterObject,{'__v': 0}).skip(skip).limit(numLimit);
       res.status(200).json({ status : httpStatusText.SUCCESS , data : allSubCategory  })

}); 

exports.getSpecificSubCtegorie = asyncHandelar( async (req ,res , next)=>{
         
       const { id } = req.params ;
       const supCategory =  await SupCategory.findById(id)
       if(!supCategory)
       {
       return next ( new ApiError ('not found', 400) )
       }
       res.status(200).json({ status : httpStatusText.SUCCESS , data : supCategory  })

}); 

//nested route
exports.nestedRouteForAddCategoryIdToParam = (req,res,next )=>
{
    if (!req.body.category)
        {
           req.body.category = req.params.categoryId
           next()
        }   
}
exports.addSubCtegorie = asyncHandelar( async (req ,res , next )=>{
    
    const { name  , category } = req.body ;

    const existed = await SupCategory.findOne({name})
    if (existed)
        {
            return next ( new ApiError ('sup category already exist ', 400) )
     
        }
    const newSupCategory = await  new SupCategory({name , slug : slugify(name) , category })
    
    await newSupCategory.save()
    return res.status(200).json({ status : httpStatusText.SUCCESS , data : newSupCategory , massage : ' sub category added successfuly ' })

}); 

exports.deleteSubCtegorie = asyncHandelar( async (req ,res , next )=>{
         
     const { id } = req.params ;
     const supCategory= await SupCategory.findByIdAndDelete( id) ;
     if (!supCategory) 
     {
        return next ( new ApiError ('sup category dose not exist ', 400) )

     }
     res.status(200).json({ status : httpStatusText.SUCCESS , message : ' deleted successfuly' })

}); 

exports.updateSubCtegorie = asyncHandelar( async (req ,res , next )=>{
         
    const { id } = req.params ;
    const { name , category } = req.body ;
    const supCategory= await SupCategory.findByIdAndUpdate( id , { name  , slug : slugify(name) , category}  ,  {new : true}) ;
    if (!supCategory) 
    {
       return next ( new ApiError ('sup category dose not exist ', 400) )

    }
    res.status(200).json({ status : httpStatusText.SUCCESS , message : ' updated successfuly' , data : supCategory })

}); 

