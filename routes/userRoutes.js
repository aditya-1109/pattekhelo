import { Router } from "express";
import { userModel } from "../Schema/userSchema.js";

const userRouter= Router();

let roomNo= 1;

userRouter.post("/signUp", async(req, res)=>{
    const {name, password, points, number}= req.body;
    try{
        const user= new userModel({name, password, points, number});
        await user.save();
        res.send("signup successfull");
    }catch(error){
        console.log(error);
        res.status(500).send(error)
    }

});

userRouter.post("/login", async(req, res)=>{
    const {name, password}= req.body;
    try{
        const user=await userModel.findOne({name, password});
        if(user){
        res.status(200).send(user);
        }else{
            console.log("no user");
            res.status(400);
        }
    }catch(error){
        console.log(error);
        res.status(500).send(error)
    }
});

userRouter.post("/getUser",async(req, res)=>{
    const {name}= req.body;
    try{
        const user= await userModel.findOne({name});
        if(user){
            res.send(user);
        }else{
            res.status(400).send("no user");
        }
    }catch(error){
        console.log(error);
        res.status(500).send(error)
    }
});

userRouter.post("/setGameType", async(req, res)=>{
    const {name, game}= req.body;
    try{
        const user= await userModel.findOne({name});
        if(user){
            user.game= game;
            await user.save();
            res.status(200).send("added");
        }else{
            res.status(400).send("no user");
        }
    }catch(error){
        console.log(error);
        res.status(500).send(error)
    }
});

userRouter.post("/getTeenRoomNo", async(req, res)=>{
    const {name }= req.body;
    try{
        const user= await userModel.findOne({name});
        if(user){
            if(!user.room_no){
                user.room_no= roomNo;
                await user.save();
                const usersInroom= await userModel.find({room_no: roomNo});
                if(usersInroom.length>=5){
                    roomNo++;
                }
                res.status(200).send({roomNo});
            }else{
                res.status(200).send({roomNo: user.room_no});
            }

            
        }else{
            res.status(400).send("no user");
        }
    }catch(error){
        console.log(error);
        res.status(500).send(error)
    }
})

export default userRouter;