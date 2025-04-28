const slugify = require ('slugify')
const asyncHandler = require('express-async-handler')
const Brand = require ('../models/brand')

const ApiError = require('../utils/apiError')
const httpStatusText = require ( '../utils/httpStatusText')


exports.createBrand = asyncHandler ( async (req,res)=>{
    
        const { name } = req.body ; 
        const newBrand = new Brand({name , slug : slugify(name)})
        await newBrand.save()
        res.status(201).json({ status : httpStatusText.SUCCESS , data : newBrand , message : "new Brand added successfuly"})
   
}
);

exports.getAllBrands = asyncHandler(async (req, res)=>{

        const { limit, page } = req.query
        const limitNum = limit * 1 || 10
        const pageNum = page * 1 || 1
        const skip = (pageNum - 1) * limitNum;
    const allBrands =  await Brand.find({},{"__v": 0}).limit(limitNum).skip(skip)
    res.status(200).json({ status : httpStatusText.SUCCESS , result : allBrands.length , page ,  data : allBrands   })

});

exports.getSpecificBrand = asyncHandler(async(req,res,next)=>{
    const { id } = req.params ; 
    const SpecificBrand =  await Brand.findById(id,{'__v': 0})
      
    if (!SpecificBrand){

        return next(new ApiError('Brand not found' , 400)) ;
    }
         
         return res.status(200).json({ status : httpStatusText.SUCCESS , data : SpecificBrand })
    
});

exports.deleteBrand = asyncHandler(async(req,res ,next)=>{
     const { id  } = req.params; 
     const deleteBrand = await Brand.findByIdAndDelete(id)
     if (!deleteBrand)
        {
            return next( new ApiError(' not found ',400))
   
        }
    return res.status(200).json({ status : httpStatusText.SUCCESS  , message : " deleted successfuly " })
    
});

exports.updateBrand = asyncHandler(async(req,res,next)=>{
    const {  id  } = req.params ;
    const { name }  = req.body ; 
    const updatedBrand = await Brand.findByIdAndUpdate(id ,{name , slug : slugify(name)} , {new : true})
    if (!updatedBrand){
        return next( new ApiError(' not found ',400))
   }
   return res.status(200).json({ status : httpStatusText.SUCCESS , data : updatedBrand , message : " updated successfuly " })
   
});



