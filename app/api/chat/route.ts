
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { getServerSession } from "next-auth";
import authOptions from '../auth/[...nextauth]/options';
import { nanoid } from '@/lib/utils'
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from '@/utils/connectDB'
import Chat from '@/models/chat'
import User from '@/models/user';

// export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  await connectDB()
  const json = await req.json()
  const { messages, previewToken } = json
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  // find the user by id
  const theUser = await User.findById(userId)

  if (previewToken) {
    openai.apiKey = previewToken
  }

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const id = json.id ?? nanoid()
      let existingChat = await Chat.findOne({ id });

      if (existingChat) {
        // If chat exists, filter and append only new messages
        const existingMessageContents = existingChat.messages.map((message: any) => message.content);
        const newMessages = messages.filter((message:any) => !existingMessageContents.includes(message.content));
        existingChat.messages.push(
          ...newMessages,
          {
            content: completion,
            role: 'assistant'
          }
        );

        await existingChat.save();
      } else {

      const title = json.messages[0].content.substring(0, 100)
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }

      const chat = new Chat(payload)
      await chat.save()

      // add the chat to the user's chats array
      theUser?.chats.push(chat._id)
      await theUser?.save()
    }
  }
  })

  return new StreamingTextResponse(stream)
}


export async function DELETE(request: NextRequest) {
  try {
    const { id, path } = await request.json();
    // console.log("Deleting chat with id:", id);

    await connectDB();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id
  
    if (!userId) {
      return new Response('Unauthorized', {
        status: 401
      })
    }

    // find the user by id
    const theUser = await User.findById(userId)

    // if the userId and the chat userId don't match, return unauthorized
    // TODO

    const deletedChat = await Chat.findOneAndDelete({ id });

    if (!deletedChat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // Revalidate the chat of the path
    revalidatePath(path || "/chat")

    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { message: "Error deleting chat" },
      { status: 500 }
    );
  }
}