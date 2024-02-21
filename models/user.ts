import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    username: String,
    slug: String,
    email: String,
    phone: String,
    image: String,
    role: String,
    job: String,
    location: String,

    medias: {
      facebook: String,
      twitter: String,
      linkedin: String,
      website: String,
    },

    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],

    adverts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advert",
      },
    ],

    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],

    comments: [
      {
        article: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
        },
        comment: String,
      },
    ],

    endorsements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    endorses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    stars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    starBy_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;