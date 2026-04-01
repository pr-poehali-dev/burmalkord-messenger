const API_URL = "https://functions.poehali.dev/884a6195-f21b-4871-81de-ad2d77e36a85";

export interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_color: string;
  status: "online" | "offline";
  last_seen?: string;
}

export interface Chat {
  id: string;
  name: string | null;
  is_group: boolean;
  created_at: string;
  last_message: string | null;
  last_message_at: string | null;
  other_user_name: string | null;
  other_user_color: string | null;
  other_user_status: string | null;
  other_user_id: string | null;
  unread_count: number;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_name: string;
  sender_color: string;
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.json();
}

export const api = {
  login: (username: string) =>
    apiFetch("/login", { method: "POST", body: JSON.stringify({ username }) }),

  register: (username: string, display_name: string) =>
    apiFetch("/register", {
      method: "POST",
      body: JSON.stringify({ username, display_name }),
    }),

  getUsers: (): Promise<{ users: User[] }> => apiFetch("/users"),

  getChats: (userId: string): Promise<{ chats: Chat[] }> =>
    apiFetch(`/chats?user_id=${userId}`),

  getMessages: (chatId: string, userId: string): Promise<{ messages: Message[] }> =>
    apiFetch(`/messages?chat_id=${chatId}&user_id=${userId}`),

  sendMessage: (chatId: string, senderId: string, content: string): Promise<{ message: Message }> =>
    apiFetch("/messages", {
      method: "POST",
      body: JSON.stringify({ chat_id: chatId, sender_id: senderId, content }),
    }),

  createChat: (user1Id: string, user2Id: string): Promise<{ chat_id: string }> =>
    apiFetch("/chats/create", {
      method: "POST",
      body: JSON.stringify({ user1_id: user1Id, user2_id: user2Id }),
    }),

  updateStatus: (userId: string, status: string) =>
    apiFetch("/users/status", {
      method: "PUT",
      body: JSON.stringify({ user_id: userId, status }),
    }),
};