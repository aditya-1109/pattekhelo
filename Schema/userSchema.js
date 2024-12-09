import mongoose from "mongoose";

const userSchema= mongoose.Schema({
    name: {type: String},
    password:{type: String}, 
    points:{type: Number}, 
    lastWin:{type: Array}, 
    number:{type: Number},
    room_no:{type: Number},
    game: {type: String},
    room_no: {type: Number},
});

export const userModel= mongoose.model("user", userSchema);