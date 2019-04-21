const mongoose = require('mongoose')
const Schema = mongoose.Schema

let TaskSchema = new Schema(
    
    {
        expencesId:{
            type:String,
            unique:true
        },
        name:{
            type:String,
            default:""
        },
        price: {
            type:String,
            default:""
        },
        category:{
           type:String,
           default:"" 
        },
        created:{
            type:Date,
            default:Date.now
        },
        lastModified:{
            type:Date,
            default:Date.now
        }

        
    }
)
mongoose.model('Task',TaskSchema);