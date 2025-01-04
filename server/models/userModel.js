import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    Companyname:{
        type:String,
        required:true,
        unique:true
    },
    ContactPersonName:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true,
        minLength:6
    },
    MobileNo:{
        type:String,
        required:true,
        length:10
    },
    GST_No:{
        type:String,
        length:15
    },
    PAN_No:{
        type:String,
        length:10
    },
    UserType:{
        type:String,
        required:true,
        enum:["Partner","Accountant","Customer"]
    },
    City:{
        type:String,
        required:true
    },
    Temp_Token:{
        type:String,
        required:true
    },
    Authorized:{
        type:Boolean,
        required:true
    }
},{timestamps: true})
const User = mongoose.model("User",userSchema);

export default User;