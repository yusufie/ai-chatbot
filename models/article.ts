import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

const articleSchema = new Schema(
    {
        // _id should be string not ObjectId
        _id:
            { 
                type: String, 
                default: () => new ObjectId().toString() 
            },

        user:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        
        likes:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],

        comments:
            [
                {
                    user:
                        {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "User",
                        },
                    comment: String,
                },
            ],

        slug: String,
        title: String,
        content: String,
        image: String,
    },
    {
        timestamps: true,
    }
);

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema );

export default Article;