
import connectDB from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from '@/app/api/auth/[...nextauth]/options';
import { revalidatePath } from 'next/cache';
import Chat from "@/models/chat";
import User from "@/models/user";

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const userId = session?.user?.id
       
    if (!userId) {
        return new Response('Unauthorized', {
            status: 401
        })
    }

    // Delete all chats for the user
    await Chat.deleteMany({ userId });

    // Clear the user's chat history
    const user = await User.findById(userId);
    user.chats = [];
    await user.save();

    revalidatePath('/')

    return NextResponse.json({ message: "Chat history cleared successfully" });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
  }
}
