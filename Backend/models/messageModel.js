// In a messaging application, it's crucial to know who sent each message. By defining a reference to the User model,
//  you can store and easily access detailed information about the sender of each message.


// In a messaging application,
//  it's crucial to know who sent each message. By defining a reference to the User model, you can store and easily access detailed information about the sender of each message. 
const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);


// users Field
// Purpose: The users field is an array that holds the IDs of all users involved in the conversation.
// Type: It's an array of user IDs (most likely ObjectIds referencing the User model).
// Example: In a chat between Alice and Bob, users might look like ["60c72b2f9b1e8b001c8e4d54", "60c72b3f9b1e8b001c8e4d56"].


// sender Field
// Purpose: The sender field specifically identifies the user who sent the message.
// Type: It is a single ObjectId that references the User model.
// Example: If Alice sends a message, sender might be 60c72b2f9b1e8b001c8e4d54.