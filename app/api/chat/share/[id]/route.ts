import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import authOptions from '../../../auth/[...nextauth]/options';
import Chat from '@/models/chat';
import connectDB from '@/utils/connectDB'


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      // Get the ID from the URL
      const id = params.id;
      console.log("Getting shared chat:", id);

      await connectDB();

      const session = await getServerSession(authOptions);
      const userId = session?.user?.id
    /*   
      if (!userId) {
        return new Response('Unauthorized', {
          status: 401
        })
      }
    */

      // Find the specific shared chat based on the id
      const sharedChat = await Chat.findOne({ id });
  
      if (!sharedChat) {
        return NextResponse.json({ message: "Shared chat not found" }, { status: 404 });
      }

      return NextResponse.json( sharedChat );
    } catch (error) {
      console.error("Error fetching article:", error);
      return NextResponse.json(
        { message: "Error fetching article" },
        { status: 500 }
      );
    }
  }