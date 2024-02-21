import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getServerSession } from "next-auth";
import authOptions from "../../../api/auth/[...nextauth]/options";

import { Chat } from '@/components/chat'
import { revalidateTag, revalidatePath } from "next/cache";

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {}
  }

  const chat = await getTheChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

async function getTheChat(id:any, userId: any) {

  const apiUrl = `http://localhost:3000/api/chat/${id}`;

  try {
    const res = await fetch(apiUrl, { next: { tags: ['TheChat'] } });

    if (res.ok) {
      revalidateTag('TheChat');
      revalidatePath(`/chat/${id}`);
    } else {
      throw new Error('Failed to fetch the TheChat data');
    }

    return res.json();
  } catch (error: any) {
    console.error('Error fetching the TheChat data:', error.message);
    // Handle the error gracefully (e.g., show a user-friendly message)
    throw error;
  }
}

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: Readonly<ChatPageProps>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getTheChat(params.id, session.user.id);
  console.log("chat page params:",params.id);

  if (!chat) {
    notFound()
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
