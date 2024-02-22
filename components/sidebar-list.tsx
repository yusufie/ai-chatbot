import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { revalidateTag, revalidatePath } from "next/cache";

interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
}

async function getTheUser (userId: any) {

  const apiUrl = `http://localhost:3000/api/user/${userId}`;

  try {
    const res = await fetch(apiUrl, { next: { tags: ['TheChat'] } });

    if (res.ok) {
      revalidateTag('TheChat');
      revalidatePath('/');
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

export async function SidebarList({ userId }: Readonly<SidebarListProps>) {
  const theUser = await getTheUser(userId)
  const chats = theUser.user.chats;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <ClearHistory isEnabled={chats?.length > 0} />
      </div>
    </div>
  )
}
