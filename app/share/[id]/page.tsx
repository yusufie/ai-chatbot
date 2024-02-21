import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";

import { ChatList } from '@/components/chat-list'
import { revalidateTag, revalidatePath } from "next/cache";

import { formatDate } from '@/lib/utils'
import { FooterText } from '@/components/footer'

interface SharePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: SharePageProps): Promise<Metadata> {

  const chat = await getSharedChat(params.id)

  return {
    title: chat?.title.slice(0, 50) ?? 'Chat'
  }
}

async function getSharedChat(id:any) {

  const apiUrl = `http://localhost:3000/api/chat/share/${id}`;

  try {
    const res = await fetch(apiUrl, { next: { tags: ['TheSharedChat'] } });

    if (res.ok) {
      revalidateTag('TheSharedChat');
      revalidatePath(`/chat/share/${id}`);
    } else {
      throw new Error('Failed to fetch the shared chat data');
    }

    return res.json();
  } catch (error: any) {
    console.error('Error fetching the shared chat data:', error.message);
    // Handle the error gracefully (e.g., show a user-friendly message)
    throw error;
  }
}

export const dynamic = "force-dynamic";

export default async function SharePage({ params }: Readonly<SharePageProps>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/share/${params.id}`)
  }

  const chat = await getSharedChat(params.id)
  console.log("shared page params:",params.id);

  if (!chat || !chat?.sharePath) {
    notFound()
  }

  return (
    <>
      <div className="flex-1 space-y-6">
        <div className="px-4 py-6 border-b bg-background md:px-6 md:py-8">
          <div className="max-w-2xl mx-auto md:px-6">
            <div className="space-y-1 md:-mx-8">
              <h1 className="text-2xl font-bold">{chat.title}</h1>
              <div className="text-sm text-muted-foreground">
                {formatDate(chat.createdAt)} · {chat.messages.length} messages
              </div>
            </div>
          </div>
        </div>
        <ChatList messages={chat.messages} />
      </div>
      <FooterText className="py-8" />
    </>
  )
}
