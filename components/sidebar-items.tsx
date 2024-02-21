'use client'

import { Chat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'
import { revalidatePath } from 'next/cache'

interface SidebarItemsProps {
  chats?: Chat[]
}

export function SidebarItems({ chats }: Readonly<SidebarItemsProps>) {

  const removeChat = async ({ id, path }: { id: string; path: string }) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, path })
      })

      console.log('response', response)
      console.log("path:", path)

      if (response.ok) {
        revalidatePath('/')
        return revalidatePath(path)
      }

    } catch (error) {
      console.error('An unexpected error happened:', error)
    }
  }

  const shareChat = async (id: string) => {
    try {
      const response = await fetch('/api/chat/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('share data:', data)
        return data;
      }

    } catch (error) {
      console.error('An unexpected error happened:', error)
    }
  }

  if (!chats?.length) return null

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <motion.div
              key={chat?.id}
              exit={{
                opacity: 0,
                height: 0
              }}
            >
              <SidebarItem index={index} chat={chat}>
                <SidebarActions
                  chat={chat}
                  removeChat={removeChat}
                  shareChat={shareChat}
                />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  )
}
