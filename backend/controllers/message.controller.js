import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

//for chat
export const sendMessage= async (req,res) => {
    try {
    const senderId= req.id;
    const receiverId=req.params.id;
    const{textMessage:message}=req.body;
    console.log(message);
    

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
     const receiverSocketId =getReceiverSocketId(receiverId);
     if(receiverSocketId){
        io.to(receiverSocketId).emit('newMessage',newMessage)
     }
     


    return res.status(200).json({
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
         const conversation= await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
         }).populate('messages');
         if(!conversation) return res.status(200).json({success:true,messages:[]})

        return res.status(200).json({success:true,messages:conversation?.messages})
    } catch (error) {
        console.log(error);
         
    }
    
}

