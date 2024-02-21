import connectDB from "@/utils/connectDB";
import User from "@/models/user";
import Article from "@/models/article";
import Chat from "@/models/chat";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET( request: NextRequest,
    { params }: { params: { id: number | string }}
  ) {
  try {
    // Get the ID from the URL
    const id = params.id;
    console.log("Fetching user with id:", id);

    await connectDB();

    // fetch all chats to demonstrate using the model
    await Chat.find();

    // fetch all articles to demonstrate using the model
    await Article.find();

    // Find the user by its ID and populate the articles, endorsements, and stars
    const user = await User.findById(id).populate({
      path: 'articles',
      select: '_id slug title content image likes comments', 
    }).populate({
      path: 'endorsements',
      select: '_id slug name username image', // Include the fields for endorsements
    }).populate({
      path: 'stars',
      select: '_id slug name username image', // Include the fields for stars
    }).populate({
      path: 'endorses',
      select: '_id slug name username image', // Include the fields for endorses
    }).populate({
      path: 'starBy_users',
      select: '_id slug name username image', // Include the fields for starredBy
    }).populate({
      path: 'chats',
      select: '_id id title path messages', // Include the fields for chats
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Revalidate the user
    revalidatePath(`/user/${id}`);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  }
}