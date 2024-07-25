const Messages = require("../models/messageModel")

module.exports = 
{
async getMessages  (req, resp, next)  {

    try{
            const {from, to} = req.body;
            const messages = await Messages.find({
                // This line queries the Messages collection to find all messages involving both users specified by from and to.
                users:{
                    $all: [from, to],
                    // The $all operator in MongoDB is used to find documents where an array contains all of the specified values
                },
            }).sort({updatedAt : 1});
            
            // : This section transforms the array of message documents into a simpler array of objects containing only the necessary information.
            const projectedMessages = messages.map((msg)=>{
                return{
                    fromSelf: msg.sender.toString() === from,
                    // Maintaining the fromSelf property as true or false is crucial for distinguishing who sent each message in a chat application
                    // In a chat interface, messages sent by the user (fromSelf: true) are typically displayed differently from messages
                    //  sent by others (fromSelf: false). This helps users easily identify their messages versus others'.
                    message: msg.message.text,
                    // Extracts the text of the message.
                };
            });
            resp.json(projectedMessages)

    }catch(e){
        next(e)
    }
},


async addMessage (req, resp, next){
   try{
     const {from, to, message} = req.body;

     const data = await Messages.create(
        {
            message: {text : message},
            users: [from, to],
            sender: from,
        }
     );
     if (data) return resp.json({msg: "Message added successfully"});
     else return resp.json({ msg: "Failed to add message to the database"})
    
}catch(ex){
    next(ex)
}
}

}