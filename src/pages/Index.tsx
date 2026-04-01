import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { api, User, Chat, Message } from "@/lib/api";

// Утилиты
function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return d.toLocaleDateString("ru-RU", { weekday: "short" });
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Аватар
function Avatar({ name, color, size = 40, status }: { name: string; color: string; size?: number; status?: string }) {
  return (
    <div className="relative flex-shrink-0">
      <div
        className="rounded-full flex items-center justify-center font-semibold text-white select-none"
        style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}
      >
        {getInitials(name)}
      </div>
      {status && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-[#1e2736]"
          style={{
            width: size * 0.3,
            height: size * 0.3,
            background: status === "online" ? "#4CAF50" : "#9E9E9E",
          }}
        />
      )}
    </div>
  );
}

// Экран входа
function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.login(username.trim());
      if (res.error) setError(res.error);
      else onLogin(res.user);
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !displayName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.register(username.trim(), displayName.trim());
      if (res.error) setError(res.error);
      else onLogin(res.user);
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1520] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5B8DEF] to-[#7B5DEF] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#5B8DEF]/30">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M8 28L4 36L14 32H32C34.2 32 36 30.2 36 28V12C36 9.8 34.2 8 32 8H8C5.8 8 4 9.8 4 12V28H8Z" fill="white" opacity="0.9"/>
              <circle cx="13" cy="20" r="2.5" fill="#5B8DEF"/>
              <circle cx="20" cy="20" r="2.5" fill="#5B8DEF"/>
              <circle cx="27" cy="20" r="2.5" fill="#5B8DEF"/>
            </svg>
          </div>
          <h1 className="text-white text-3xl font-bold tracking-wide">БурмалКорд</h1>
          <p className="text-[#8899aa] mt-1 text-sm">Мессенджер нового поколения</p>
        </div>

        {/* Карточка */}
        <div className="bg-[#1e2736] rounded-2xl p-6 shadow-2xl">
          {/* Табы */}
          <div className="flex bg-[#141d2b] rounded-xl p-1 mb-6">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === "login"
                  ? "bg-[#5B8DEF] text-white shadow"
                  : "text-[#8899aa] hover:text-white"
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === "register"
                  ? "bg-[#5B8DEF] text-white shadow"
                  : "text-[#8899aa] hover:text-white"
              }`}
            >
              Регистрация
            </button>
          </div>

          <div className="space-y-3">
            {tab === "register" && (
              <input
                className="w-full bg-[#141d2b] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#2a3a4a] focus:border-[#5B8DEF] transition-colors placeholder:text-[#556677]"
                placeholder="Ваше имя"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            )}
            <input
              className="w-full bg-[#141d2b] text-white rounded-xl px-4 py-3 text-sm outline-none border border-[#2a3a4a] focus:border-[#5B8DEF] transition-colors placeholder:text-[#556677]"
              placeholder="Имя пользователя (login)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())}
            />

            {error && (
              <p className="text-[#ff5555] text-xs bg-[#ff555520] px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              onClick={tab === "login" ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#5B8DEF] to-[#7B5DEF] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-[#5B8DEF]/30"
            >
              {loading ? "Загрузка..." : tab === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>

          {tab === "login" && (
            <p className="text-[#556677] text-xs text-center mt-4">
              Тестовые аккаунты: alex, maria, ivan, kate, dmitry
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Главный интерфейс мессенджера
function MessengerApp({ currentUser, onLogout }: { currentUser: User; onLogout: () => void }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"chats" | "contacts" | "profile">("chats");
  // На мобильном: null = список чатов, chat = открытый чат
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Загрузка чатов
  const loadChats = async () => {
    try {
      const res = await api.getChats(currentUser.id);
      if (res.chats) setChats(res.chats);
    } finally {
      setLoadingChats(false);
    }
  };

  // Загрузка сообщений
  const loadMessages = async (chatId: string) => {
    setLoadingMessages(true);
    try {
      const res = await api.getMessages(chatId, currentUser.id);
      if (res.messages) {
        setMessages(res.messages);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadChats();
    const res = api.getUsers();
    res.then((r) => r.users && setUsers(r.users));

    pollingRef.current = setInterval(() => {
      loadChats();
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      const msgPoll = setInterval(() => loadMessages(selectedChat.id), 2000);
      return () => clearInterval(msgPoll);
    }
  }, [selectedChat?.id]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowNewChat(false);
    setMobileView("chat");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleBackToList = () => {
    setMobileView("list");
    setSelectedChat(null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sending) return;
    const text = newMessage.trim();
    setNewMessage("");
    setSending(true);
    try {
      const res = await api.sendMessage(selectedChat.id, currentUser.id, text);
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        loadChats();
      }
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleStartChat = async (user: User) => {
    const res = await api.createChat(currentUser.id, user.id);
    if (res.chat_id) {
      await loadChats();
      const updatedChats = await api.getChats(currentUser.id);
      const chat = updatedChats.chats?.find((c: Chat) => c.id === res.chat_id);
      if (chat) {
        setChats(updatedChats.chats);
        handleSelectChat(chat);
      }
    }
    setShowNewChat(false);
  };

  const filteredChats = chats.filter((c) => {
    const name = c.is_group ? c.name : c.other_user_name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = users.filter(
    (u) =>
      u.id !== currentUser.id &&
      (u.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getChatName = (chat: Chat) => {
    if (chat.is_group) return chat.name || "Группа";
    return chat.other_user_name || "Неизвестный";
  };

  const getChatColor = (chat: Chat) => {
    if (chat.is_group) return "#9C27B0";
    return chat.other_user_color || "#5B8DEF";
  };

  const totalUnread = chats.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  // ---- Панель чатов (боковая на десктопе / полноэкранная на мобильном) ----
  const ChatListPanel = () => (
    <div className="flex flex-col h-full bg-[#131d2b]">
      {/* Шапка */}
      <div className="p-4 border-b border-[#1e2e40] safe-top">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B8DEF] to-[#7B5DEF] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
                <path d="M8 28L4 36L14 32H32C34.2 32 36 30.2 36 28V12C36 9.8 34.2 8 32 8H8C5.8 8 4 9.8 4 12V28H8Z" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-white text-base">БурмалКорд</span>
          </div>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="w-9 h-9 rounded-xl bg-[#1e2e40] hover:bg-[#2a3e50] active:scale-95 transition-all flex items-center justify-center text-[#8899aa] hover:text-white"
            title="Новый чат"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>

        {/* Поиск */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#556677]"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="w-full bg-[#1e2e40] text-white rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-[#556677] focus:bg-[#253040]"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Новый чат — список контактов */}
      {showNewChat && (
        <div className="border-b border-[#1e2e40]">
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <p className="text-[#8899aa] text-xs font-semibold uppercase tracking-wider">Новый чат</p>
            <button onClick={() => setShowNewChat(false)} className="text-[#556677] hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <p className="text-[#556677] text-xs text-center py-4">Нет пользователей</p>
            ) : filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleStartChat(user)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1e2e40] active:bg-[#253040] transition-colors"
              >
                <Avatar name={user.display_name} color={user.avatar_color} size={40} status={user.status} />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{user.display_name}</p>
                  <p className="text-[#556677] text-xs">@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Список чатов */}
      <div className="flex-1 overflow-y-auto">
        {loadingChats ? (
          <div className="flex items-center justify-center h-24">
            <div className="w-6 h-6 border-2 border-[#5B8DEF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#556677] px-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p className="text-sm font-medium text-center">Нет чатов</p>
            <button onClick={() => setShowNewChat(true)} className="text-[#5B8DEF] text-xs mt-2 hover:underline">
              Начать переписку →
            </button>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const name = getChatName(chat);
            const color = getChatColor(chat);
            const isSelected = selectedChat?.id === chat.id;
            return (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors active:scale-[0.98] ${
                  isSelected ? "bg-[#1e3a5f]" : "hover:bg-[#1a2535] active:bg-[#1e2e40]"
                }`}
              >
                <Avatar
                  name={name}
                  color={color}
                  size={50}
                  status={chat.is_group ? undefined : (chat.other_user_status as "online" | "offline" | undefined)}
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-semibold truncate">{name}</p>
                    {chat.last_message_at && (
                      <span className="text-[#556677] text-xs ml-2 flex-shrink-0">
                        {formatTime(chat.last_message_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[#8899aa] text-xs truncate">
                      {chat.last_message || "Нет сообщений"}
                    </p>
                    {chat.unread_count > 0 && (
                      <span className="ml-2 flex-shrink-0 bg-[#5B8DEF] text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-semibold px-1">
                        {chat.unread_count > 99 ? "99+" : chat.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Кнопка "Пригласить" */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setShowInviteModal(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#5B8DEF]/20 to-[#7B5DEF]/20 hover:from-[#5B8DEF]/30 hover:to-[#7B5DEF]/30 border border-[#5B8DEF]/30 hover:border-[#5B8DEF]/50 transition-all active:scale-[0.98]"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5B8DEF] to-[#7B5DEF] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <span className="text-[#8899aa] text-xs font-medium">Пригласить друга</span>
        </button>
      </div>

      {/* Профиль внизу */}
      <div className="p-3 border-t border-[#1e2e40] flex items-center gap-3">
        <Avatar name={currentUser.display_name} color={currentUser.avatar_color} size={40} status="online" />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{currentUser.display_name}</p>
          <p className="text-[#4CAF50] text-xs">В сети</p>
        </div>
        <button
          onClick={onLogout}
          className="w-8 h-8 rounded-lg hover:bg-[#1e2e40] transition-colors flex items-center justify-center text-[#556677] hover:text-[#ff5555] active:scale-95"
          title="Выйти"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  );

  // ---- Панель сообщений ----
  const ChatPanel = () => (
    <div className="flex flex-col h-full">
      {/* Шапка чата */}
      <div className="flex items-center gap-3 px-3 py-3 bg-[#131d2b] border-b border-[#1e2e40] shadow-sm safe-top">
        {/* Кнопка назад (только мобильный) */}
        <button
          onClick={handleBackToList}
          className="md:hidden w-9 h-9 rounded-xl hover:bg-[#1e2e40] flex items-center justify-center text-[#8899aa] hover:text-white transition-colors active:scale-95 flex-shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {selectedChat && (
          <>
            <Avatar
              name={getChatName(selectedChat)}
              color={getChatColor(selectedChat)}
              size={40}
              status={selectedChat.is_group ? undefined : (selectedChat.other_user_status as "online" | "offline" | undefined)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{getChatName(selectedChat)}</p>
              <p className="text-xs">
                {selectedChat.is_group
                  ? <span className="text-[#8899aa]">Группа</span>
                  : selectedChat.other_user_status === "online"
                  ? <span className="text-[#4CAF50]">В сети</span>
                  : <span className="text-[#8899aa]">Был(а) недавно</span>}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Сообщения */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
        style={{ background: "linear-gradient(180deg, #0d1520 0%, #111a27 100%)" }}
      >
        {loadingMessages ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#5B8DEF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#556677] py-16">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-3 opacity-25">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p className="text-sm font-medium">Нет сообщений</p>
            <p className="text-xs mt-1 text-[#445566]">Начните переписку!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isMe = msg.sender_id === currentUser.id;
              const prevMsg = messages[idx - 1];
              const nextMsg = messages[idx + 1];
              const showAvatar = !isMe && (!prevMsg || prevMsg.sender_id !== msg.sender_id);
              const showName = selectedChat?.is_group && !isMe && showAvatar;
              const isLastInGroup = !nextMsg || nextMsg.sender_id !== msg.sender_id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} ${isLastInGroup ? "mb-1" : ""}`}
                >
                  {/* Аватар */}
                  <div className="w-8 flex-shrink-0 self-end">
                    {!isMe && isLastInGroup && (
                      <Avatar name={msg.sender_name} color={msg.sender_color} size={30} />
                    )}
                  </div>

                  {/* Пузырь */}
                  <div className={`max-w-[72%] md:max-w-[60%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                    {showName && (
                      <span className="text-xs font-semibold mb-1 px-1" style={{ color: msg.sender_color }}>
                        {msg.sender_name}
                      </span>
                    )}
                    <div
                      className={`px-3.5 py-2 text-sm leading-relaxed break-words ${
                        isMe
                          ? "bg-gradient-to-br from-[#5B8DEF] to-[#4a7de0] text-white rounded-2xl rounded-br-sm"
                          : "bg-[#1e2e40] text-[#ddeeff] rounded-2xl rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className={`text-[10px] mt-0.5 text-[#445566] px-1 flex items-center gap-1 ${isMe ? "flex-row-reverse" : ""}`}>
                      {formatTime(msg.created_at)}
                      {isMe && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={msg.is_read ? "#5B8DEF" : "#445566"} strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Ввод сообщения */}
      <div className="px-3 py-3 bg-[#131d2b] border-t border-[#1e2e40] safe-bottom">
        <div className="flex items-center gap-2 bg-[#1e2e40] rounded-2xl px-4 py-2.5">
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#556677]"
            placeholder="Написать сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="w-9 h-9 rounded-xl bg-[#5B8DEF] hover:bg-[#4a7de0] disabled:opacity-40 flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // ---- Экран контактов (мобильный таб) ----
  const ContactsTab = () => (
    <div className="flex flex-col h-full bg-[#0d1520]">
      <div className="p-4 pt-5 border-b border-[#1e2e40]">
        <h2 className="text-white text-xl font-bold mb-3">Контакты</h2>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#556677]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="w-full bg-[#1e2e40] text-white rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-[#556677]"
            placeholder="Найти пользователя..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#556677]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p className="text-sm">Нет пользователей</p>
          </div>
        ) : filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => {
              handleStartChat(user);
              setActiveTab("chats");
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#1a2535] active:bg-[#1e2e40] transition-colors"
          >
            <Avatar name={user.display_name} color={user.avatar_color} size={50} status={user.status} />
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-semibold">{user.display_name}</p>
              <p className="text-[#556677] text-xs mt-0.5">@{user.username}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${user.status === "online" ? "bg-[#4CAF50]/20 text-[#4CAF50]" : "bg-[#556677]/20 text-[#556677]"}`}>
              {user.status === "online" ? "онлайн" : "оффлайн"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  // ---- Экран профиля (мобильный таб) ----
  const ProfileTab = () => (
    <div className="flex flex-col h-full bg-[#0d1520] overflow-y-auto">
      <div className="p-4 pt-5">
        <h2 className="text-white text-xl font-bold mb-6">Профиль</h2>

        {/* Аватар и имя */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <Avatar name={currentUser.display_name} color={currentUser.avatar_color} size={90} status="online" />
          </div>
          <p className="text-white text-xl font-bold">{currentUser.display_name}</p>
          <p className="text-[#8899aa] text-sm mt-1">@{currentUser.username}</p>
          <span className="mt-2 text-xs px-3 py-1 rounded-full bg-[#4CAF50]/20 text-[#4CAF50]">В сети</span>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#1e2736] rounded-2xl p-4 text-center">
            <p className="text-white text-2xl font-bold">{chats.length}</p>
            <p className="text-[#8899aa] text-xs mt-1">Чатов</p>
          </div>
          <div className="bg-[#1e2736] rounded-2xl p-4 text-center">
            <p className="text-white text-2xl font-bold">{users.length}</p>
            <p className="text-[#8899aa] text-xs mt-1">Пользователей</p>
          </div>
        </div>

        {/* Пригласить */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="w-full flex items-center gap-3 px-4 py-4 bg-[#1e2736] rounded-2xl mb-3 active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B8DEF] to-[#7B5DEF] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-white text-sm font-semibold">Пригласить друга</p>
            <p className="text-[#556677] text-xs mt-0.5">Поделиться ссылкой или QR-кодом</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#556677" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        {/* Выйти */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-4 bg-[#1e2736] rounded-2xl active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#ff5555]/20 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5555" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-[#ff5555] text-sm font-semibold">Выйти</p>
            <p className="text-[#556677] text-xs mt-0.5">Завершить сессию</p>
          </div>
        </button>
      </div>
    </div>
  );

  // ---- Нижняя навигация (только мобильный) ----
  const BottomNav = () => (
    <div className="md:hidden flex items-center bg-[#131d2b] border-t border-[#1e2e40] safe-bottom">
      <button
        onClick={() => { setActiveTab("chats"); setMobileView("list"); }}
        className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "chats" ? "text-[#5B8DEF]" : "text-[#556677]"}`}
      >
        <div className="relative">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === "chats" ? "2.5" : "2"}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {totalUnread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#5B8DEF] text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium">Чаты</span>
      </button>

      <button
        onClick={() => { setActiveTab("contacts"); setMobileView("list"); }}
        className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "contacts" ? "text-[#5B8DEF]" : "text-[#556677]"}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === "contacts" ? "2.5" : "2"}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span className="text-[10px] font-medium">Контакты</span>
      </button>

      <button
        onClick={() => { setActiveTab("profile"); setMobileView("list"); }}
        className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${activeTab === "profile" ? "text-[#5B8DEF]" : "text-[#556677]"}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === "profile" ? "2.5" : "2"}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span className="text-[10px] font-medium">Профиль</span>
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0d1520] text-white overflow-hidden">
      {/* ========== ДЕСКТОП ========== */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Боковая панель */}
        <div className="w-[320px] min-w-[280px] flex-shrink-0 border-r border-[#1e2e40]">
          <ChatListPanel />
        </div>

        {/* Область сообщений */}
        <div className="flex-1 min-w-0">
          {selectedChat ? (
            <ChatPanel />
          ) : (
            <div className="flex-1 h-full flex flex-col items-center justify-center bg-[#0d1520]">
              <div className="text-center px-4">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#5B8DEF] to-[#7B5DEF] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#5B8DEF]/20">
                  <svg width="52" height="52" viewBox="0 0 40 40" fill="none">
                    <path d="M8 28L4 36L14 32H32C34.2 32 36 30.2 36 28V12C36 9.8 34.2 8 32 8H8C5.8 8 4 9.8 4 12V28H8Z" fill="white" opacity="0.9"/>
                    <circle cx="13" cy="20" r="2.5" fill="#5B8DEF"/>
                    <circle cx="20" cy="20" r="2.5" fill="#5B8DEF"/>
                    <circle cx="27" cy="20" r="2.5" fill="#5B8DEF"/>
                  </svg>
                </div>
                <h2 className="text-white text-2xl font-bold mb-2">Добро пожаловать в БурмалКорд</h2>
                <p className="text-[#8899aa] text-sm max-w-xs mx-auto">
                  Выберите чат слева или начните новую переписку, нажав на <span className="text-[#5B8DEF]">+</span>
                </p>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#5B8DEF] to-[#7B5DEF] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-[#5B8DEF]/30"
                >
                  Начать чат
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== МОБИЛЬНЫЙ ========== */}
      <div className="md:hidden flex-1 overflow-hidden flex flex-col">
        {/* Основной контент мобильного */}
        <div className="flex-1 overflow-hidden">
          {/* Открытый чат — занимает весь экран */}
          {mobileView === "chat" && selectedChat ? (
            <div className="h-full">
              <ChatPanel />
            </div>
          ) : (
            /* Таб-содержимое */
            <div className="h-full">
              {activeTab === "chats" && <ChatListPanel />}
              {activeTab === "contacts" && <ContactsTab />}
              {activeTab === "profile" && <ProfileTab />}
            </div>
          )}
        </div>

        {/* Нижняя навигация (скрывается когда открыт чат) */}
        {mobileView !== "chat" && <BottomNav />}
      </div>

      {/* Модальное окно "Пригласить друга" */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowInviteModal(false)}
        >
          <div className="bg-[#1e2736] rounded-t-3xl md:rounded-2xl p-6 w-full md:max-w-sm shadow-2xl border border-[#2a3a4a] animate-in slide-in-from-bottom md:zoom-in-95 duration-200 safe-bottom">
            {/* Drag handle (мобильный) */}
            <div className="md:hidden w-10 h-1 bg-[#2a3a4a] rounded-full mx-auto mb-5" />

            {/* Заголовок */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B8DEF] to-[#7B5DEF] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                </div>
                <h2 className="text-white font-bold text-base">Пригласить друга</h2>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-[#2a3a4a] flex items-center justify-center text-[#556677] hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <p className="text-[#8899aa] text-sm text-center mb-5">
              Поделись ссылкой или QR-кодом — друг откроет <span className="text-[#5B8DEF] font-medium">БурмалКорд</span> прямо в браузере
            </p>

            {/* QR-код */}
            <div className="flex justify-center mb-5">
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                <QRCodeSVG
                  value={window.location.origin}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#0d1520"
                  level="M"
                />
              </div>
            </div>

            {/* Ссылка */}
            <div className="flex items-center gap-2 bg-[#141d2b] rounded-xl px-3 py-2.5 border border-[#2a3a4a] mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#556677" strokeWidth="2" className="flex-shrink-0">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              <span className="text-[#8899aa] text-xs flex-1 truncate">{window.location.origin}</span>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.origin)}
                className="text-[#5B8DEF] hover:text-[#7B5DEF] transition-colors flex-shrink-0"
                title="Скопировать"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>

            {/* Кнопка поделиться */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "БурмалКорд",
                    text: "Присоединяйся к БурмалКорд — мессенджеру нового поколения!",
                    url: window.location.origin,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.origin);
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-[#5B8DEF] to-[#7B5DEF] text-white rounded-xl text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#5B8DEF]/30 flex items-center justify-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Поделиться ссылкой
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Корневой компонент
export default function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("burmalkord_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user: User) => {
    localStorage.setItem("burmalkord_user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("burmalkord_user");
    setCurrentUser(null);
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;
  return <MessengerApp currentUser={currentUser} onLogout={handleLogout} />;
}
