const slugify = require ('slugify')
const asyncHandler = require('express-async-handler')
const User = require ('../models/user')
const ApiError = require('../utils/apiError')
const httpStatusText = require ( '../utils/httpStatusText')
const bcrypt = require ('bcrypt')

exports.createUser = asyncHandler ( async (req,res)=>{
    
        req.body.slug = slugify(req.body.name)
        const hashedPassword =  await bcrypt.hash(req.body.password , 10)
        const newUser = new User({...req.body , password : hashedPassword })
        await newUser.save()
        res.status(201).json({ status : httpStatusText.SUCCESS , data : newUser , message : "new User added successfuly"})
   
}
);

exports.getAllUsers = asyncHandler(async (req, res)=>{

        const { limit, page } = req.query
        const limitNum = limit * 1 || 10
        const pageNum = page * 1 || 1
        const skip = (pageNum - 1) * limitNum;
    const allUsers =  await User.find({},{"__v": 0}).limit(limitNum).skip(skip)
    res.status(200).json({ status : httpStatusText.SUCCESS , result : allUsers.length , page ,  data : allUsers   })

});

exports.getSpecificUser = asyncHandler(async(req,res,next)=>{
    const { id } = req.params ; 
    const SpecificUser =  await User.findById(id,{'__v': 0})
      
    if (!SpecificUser){

        return next(new ApiError('User not found' , 400)) ;
    }
         
         return res.status(200).json({ status : httpStatusText.SUCCESS , data : SpecificUser })
    
});

exports.deleteUser = asyncHandler(async(req,res ,next)=>{
     const { id  } = req.params; 
     const deleteUser = await User.findByIdAndDelete(id)
     if (!deleteUser)
        {
            return next( new ApiError(' not found ',400))
   
        }
    return res.status(200).json({ status : httpStatusText.SUCCESS  , message : " deleted successfuly " })
    
});

exports.updateUser = asyncHandler(async(req,res,next)=>{
    const {  id  } = req.params ;
    const { name }  = req.body ; 
    const updatedUser = await User.findByIdAndUpdate(id ,{name , slug : slugify(name)} , {new : true})
    if (!updatedUser){
        return next( new ApiError(' not found ',400))
   }
   return res.status(200).json({ status : httpStatusText.SUCCESS , data : updatedUser , message : " updated successfuly " })
   
});



