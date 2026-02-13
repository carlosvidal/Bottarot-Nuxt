import { defineStore } from 'pinia'

export const useChatStore = defineStore('chats', () => {
  const chatList = ref<any[]>([])
  const isLoading = ref(false)

  // Helper to get Supabase client (client-only)
  const getSupabase = () => {
    if (!import.meta.client) return null
    const { $supabase } = useNuxtApp()
    return $supabase as any
  }

  // Helper to get API URL
  const getApiUrl = () => {
    const config = useRuntimeConfig()
    return config.public.apiUrl as string
  }

  const fetchChatList = async (userId: string) => {
    if (!userId) return

    const supabase = getSupabase()
    if (!supabase) return

    isLoading.value = true
    try {
      const { data, error } = await supabase.rpc('get_chat_list', { p_user_id: userId })
      if (error) throw error
      chatList.value = data || []
    } catch (error) {
      console.error('Error fetching chat list:', error)
    } finally {
      isLoading.value = false
    }
  }

  const deleteChat = async (chatId: string, userId: string) => {
    if (!userId) throw new Error('User not authenticated')

    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase not available')

    const index = chatList.value.findIndex(c => c.id === chatId)
    if (index === -1) return
    const deletedChat = chatList.value.splice(index, 1)[0]

    try {
      const { error } = await supabase.rpc('delete_chat', {
        p_chat_id: chatId,
        p_user_id: userId,
      })
      if (error) {
        chatList.value.splice(index, 0, deletedChat)
        throw error
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
      throw error
    }
  }

  const renameChat = async (chatId: string, newTitle: string, userId: string) => {
    if (!userId) throw new Error('User not authenticated')
    if (!newTitle || !newTitle.trim()) return

    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase not available')

    const index = chatList.value.findIndex(c => c.id === chatId)
    if (index === -1) return

    const oldTitle = chatList.value[index].title
    chatList.value[index].title = newTitle

    try {
      const { error } = await supabase.rpc('update_chat_title', {
        p_chat_id: chatId,
        p_user_id: userId,
        p_new_title: newTitle,
      })
      if (error) {
        chatList.value[index].title = oldTitle
        throw error
      }
    } catch (error) {
      console.error('Error renaming chat:', error)
      throw error
    }
  }

  const toggleFavorite = async (chatId: string, userId: string) => {
    if (!userId) throw new Error('User not authenticated')

    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase not available')

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
      const { error } = await supabase.rpc('toggle_chat_favorite', {
        p_chat_id: chatId,
        p_user_id: userId,
      })
      if (error) {
        chat.is_favorite = oldStatus
        throw error
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      throw error
    }
  }

  const closeChat = async (chatId: string, userId: string) => {
    if (!userId) throw new Error('User not authenticated')

    const apiUrl = getApiUrl()
    const chat = chatList.value.find(c => c.id === chatId)
    if (!chat) return

    chat.is_closed = true

    try {
      const response = await fetch(`${apiUrl}/api/chat/${chatId}/close`, {
        method: 'POST',
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
