import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";

//for chat
export const sendMessage= async (req,res) => {
    try {
    const senderId= req.id;
    const receiverId=req.params.id;
    const{message}=req.body;

    let conversation= await Conversation.findOne({      //checks i there is any conversation between sender and receiver
       participants:{$all:[senderId,receiverId]}
    })
    //establish conversation if not started yet

    if(!conversation){
        conversation= await Conversation.create({
            participants:[senderId,receiverId]
        })
    };
    const newMessage= await Message.create({
        senderId,
        receiverId,
        message
    })
    if(newMessage) conversation.messages.push(newMessage._id) 
        await Promise.all([conversation.save(),newMessage.save()])

    //implement socket io for real time data transfer
     


    return res.status.json({
        newMessage,
        success:true
    })

    } catch (error) {
        console.log(error);
        
    }
    
} 

//get Messgage

export const getMessage= async (req,res) => {
    try {
        const senderId =req.id;
        const receiverId= req.params.id;
         const conversation= await Conversation.find({
            participants:{$all:{senderId,receiverId}}
         });
         if(!conversation) return res.status(200).json({success:true,messages:[]})

        return res.status(200).json({success:true,messages:conversation?.messages})
    } catch (error) {
        console.log(error);
         
    }
    
}