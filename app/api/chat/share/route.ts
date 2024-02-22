import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import authOptions from '../../auth/[...nextauth]/options';
import Chat from '@/models/chat';
import connectDB from '@/utils/connectDB'

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    console.log("Sharing chat with id:", id);

    await connectDB();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id
  
    if (!userId) {
      return new Response('Unauthorized', {
        status: 401
      })
    }
 
    const chat = await Chat.findOne({ id });
    /* 
        if (!chat || chat.userId.toString() !== session?.user?.id) {
            return new Response('Something went wrong', {
                status: 401
            })
        }
    */
    chat.sharePath = `/share/${chat.id}`;

    await chat.save();

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error sharing chat:', error);
    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
  }
}
