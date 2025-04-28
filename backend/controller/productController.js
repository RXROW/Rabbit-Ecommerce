const slugify = require ('slugify')
const asyncHandler = require('express-async-handler')
const Product = require ('../models/product')
const ApiError = require('../utils/apiError')
const httpStatusText = require ( '../utils/httpStatusText')

exports.createProduct = asyncHandler ( async (req,res)=>{
        
        req.body.slug = slugify(req.body.title)
        const newProduct = new Product(req.body)
        await newProduct.save()
        res.status(201).json({ status : httpStatusText.SUCCESS , data : newProduct , message : "new product added successfuly"})
   
}
);

exports.getAllProducts = asyncHandler(async (req, res)=>{

        const { limit, page } = req.query
        const limitNum = limit * 1 || 10
        const pageNum = page * 1 || 1
        const skip = (pageNum - 1) * limitNum;
    const allProducts =  await Product.find({},{"__v": 0}).populate({ path :"category", select : "name-_id"}).limit(limitNum).skip(skip)
    res.status(200).json({ status : httpStatusText.SUCCESS , result : allProducts.length , page ,  data : allProducts   })

});

exports.getSpecificProduct = asyncHandler(async(req,res,next)=>{
    const { id } = req.params ; 
    const SpecificProduct =  await Product.findById(id,{'__v': 0}).populate({ path :"category", select : "name -_id"})
      
    if (!SpecificProduct){

        return next(new ApiError('product not found' , 400)) ;
    }
         
         return res.status(200).json({ status : httpStatusText.SUCCESS , data : SpecificProduct })
    
});

exports.deleteProduct = asyncHandler(async(req,res ,next)=>{
     const { id  } = req.params; 
     const deleteProduct = await Product.findByIdAndDelete(id)
     if (!deleteProduct)
        {
            return next( new ApiError(' not found ',400))
   
        }
    return res.status(200).json({ status : httpStatusText.SUCCESS  , message : " deleted successfuly " })
    
});

exports.updateProduct = asyncHandler(async(req,res,next)=>{
    const {  id  } = req.params ;
    if ( req.body.title){
        req.body.slag = slugify(req.body.title )
    }
    const updatedProduct = await Product.findByIdAndUpdate(id ,req.body , {new : true})
    if (!updatedProduct){
        return next( new ApiError(' not found ',400))
   }
   return res.status(200).json({ status : httpStatusText.SUCCESS , data : updatedProduct , message : " updated successfuly " })
   
});



