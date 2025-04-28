 const asyncHandelar = require('express-async-handler')
const httpStatusText = require ('../utils/httpStatusText')
const User = require ('../models/user')
const bcrypt = require('bcrypt')
const generateJWT = require('../utils/generateJWT')
const ApiError = require('../utils/apiError')

 exports.signup = asyncHandelar ( async (req,res)=>{

      const hashedPassword = await bcrypt.hash(req.body.password , 10)
      const newUser =  new User ({...req.body , password : hashedPassword }) 
      await newUser.save()
      const token =  await generateJWT({email : newUser.email, id : newUser._id ,role : newUser.role})
      res.status(201).json({status : httpStatusText.SUCCESS , data : newUser , token , message : 'signup succeccfuly'})

 }); 

 exports.login = asyncHandelar ( async (req,res,next)=>{
    const { email , password } = req.body
     const user = await User.findOne({email})
     if (!user)
        {
         return next( new ApiError('wrong email or password'))
        }
     const matchedPassword = await bcrypt.compare(password ,user.password)
     if (!matchedPassword)
     {
      return next( new ApiError('wrong email or password' , 401))
     }

     const token =  await generateJWT({email : user.email, id : user._id ,role : user.role})
     res.status(201).json({status : httpStatusText.SUCCESS , data : user , token , message : 'login succeccfuly'})


 }); 
