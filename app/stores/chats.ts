import { defineStore } from 'pinia'

export const useChatStore = defineStore('chats', () => {
  const chatList = ref<any[]>([])
  const isLoading = ref(false)

  const getApiUrl = () => {
    const config = useRuntimeConfig()
    return config.public.apiUrl as string
  }

  const authedFetch = (path: string, init: RequestInit = {}) =>
    fetch(`${getApiUrl()}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
      ...init,
    })

  const fetchChatList = async () => {
    isLoading.value = true
    try {
      const res = await authedFetch('/api/chats')
      if (!res.ok) throw new Error(`status ${res.status}`)
      const { chats } = await res.json()
      chatList.value = chats || []
    } catch (error) {
      console.error('Error fetching chat list:', error)
    } finally {
      isLoading.value = false
    }
  }

  const deleteChat = async (chatId: string) => {
    const index = chatList.value.findIndex(c => c.id === chatId)
    if (index === -1) return
    const deletedChat = chatList.value.splice(index, 1)[0]
    try {
      const res = await authedFetch(`/api/chats/${chatId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`status ${res.status}`)
    } catch (error) {
      chatList.value.splice(index, 0, deletedChat)
      console.error('Error deleting chat:', error)
      throw error
    }
  }

  const renameChat = async (chatId: string, newTitle: string) => {
    if (!newTitle || !newTitle.trim()) return
    const index = chatList.value.findIndex(c => c.id === chatId)
    if (index === -1) return
    const oldTitle = chatList.value[index].title
    chatList.value[index].title = newTitle
    try {
      const res = await authedFetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: newTitle }),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
    } catch (error) {
      chatList.value[index].title = oldTitle
      console.error('Error renaming chat:', error)
      throw error
    }
  }

  const toggleFavorite = async (chatId: string) => {
    const chat = chatList.value.find(c => c.id === chatId)
    if (!chat) return
    const oldStatus = chat.is_favorite
    chat.is_favorite = !oldStatus
    chatList.value.sort((a: any, b: any) => {
      const favDiff = (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0)
      if (favDiff !== 0) return favDiff
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    try {
      const res = await authedFetch(`/api/chats/${chatId}/favorite`, { method: 'POST' })
      if (!res.ok) throw new Error(`status ${res.status}`)
    } catch (error) {
      chat.is_favorite = oldStatus
      console.error('Error toggling favorite:', error)
      throw error
    }
  }

  const closeChat = async (chatId: string, userId: string) => {
    if (!userId) throw new Error('User not authenticated')
    const chat = chatList.value.find(c => c.id === chatId)
    if (!chat) return
    chat.is_closed = true
    try {
      const response = await fetch(`${getApiUrl()}/api/chat/${chatId}/close`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) {
        chat.is_closed = false
        throw new Error('Failed to close chat')
      }
      return true
    } catch (error) {
      console.error('Error closing chat:', error)
      chat.is_closed = false
      throw error
    }
  }

  return {
    chatList,
    isLoading,
    fetchChatList,
    deleteChat,
    renameChat,
    toggleFavorite,
    closeChat,
  }
})
