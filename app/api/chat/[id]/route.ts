import connectDB from "@/utils/connectDB";
import Chat from "@/models/chat";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest,
    { params }: { params: { id: string }}
  ) {
  try {
    // Get the ID from the URL
    const id = params.id;
    console.log("Fetching chat with id:", id);

    await connectDB();

    // Find the Chat by its field that is id but not _id
    const chat = await Chat.findOne({ id });

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // Revalidate the chat
    revalidatePath(`/chat/${id}`);

    return NextResponse.json( chat );
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { message: "Error fetching chat" },
      { status: 500 }
    );
  }
}