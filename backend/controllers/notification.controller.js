import Notification from '../model/notification.model.js'
export const createNotifiction=async(req,res)=>{

    try {
      const {userId}= req.params
      const {message}= req.body
  
      const notification = await new  Notification({userId,message})
      await notification.save()
      res.status(201).json(notification)
  }
     catch (error) {
     console.log(error);
     
    }
 }

 export const getNotification=async (req,res) => {

        try {
          const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
          res.json(notifications);
        } catch (err) {
          res.status(500).json({ message: 'Server Error' });
        }
      
      
    
 }