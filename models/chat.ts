import mongoose, { Schema } from 'mongoose';
import { ObjectId } from "mongodb";

const chatSchema = new Schema(
    {
        _id:
            { 
                type: String, 
                default: () => new ObjectId().toString() 
            },

        id: 
            {
                type: String,
                required: true
            },

        title: 
            {
                type: String,
                required: true
            },

        userId: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

        path: 
            {
                type: String,
                required: true
            },

        sharePath:
            {
                type: String,
                required: false
            },

        messages: 
        [
            {
                content: 
                    {
                        type: String,
                        required: true
                    },
                role: 
                    {
                        type: String,
                        enum: ['user', 'assistant'], // Assuming 'user' or 'assistant' roles
                        required: true
                    }
            }
        ]
    },
    
    {
        timestamps: true,
        collection: 'chats'
    }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema );

export default Chat;