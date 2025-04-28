require('dotenv').config()

const senErrorsForDev  = (error , res)=>{
    res.status(error.statusCode || 500 )
    .json({ 
        status :error.status || 'error' 
        , message : error.message || 'Internal Server Error' 
        , stack : error.stack  })
}

const senErrorsForProdaction  = (error , res)=>{
    res.status(error.statusCode || 500 )
    .json({ 
        status :error.status || 'error' 
        , message : error.message || 'Internal Server Error' 
         })
}


const globalError = (error , req, res , next)=>{
   if (process.env.NODE_ENV === 'development') 
    {
        senErrorsForDev(error , res)
    } else {
        senErrorsForProdaction(error , res)

    }
    
}



module.exports = globalError