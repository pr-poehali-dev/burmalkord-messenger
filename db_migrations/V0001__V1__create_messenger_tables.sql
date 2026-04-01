CREATE TABLE t_p33366711_burmalkord_messenger.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_color VARCHAR(20) DEFAULT '#5B8DEF',
  status VARCHAR(20) DEFAULT 'online',
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p33366711_burmalkord_messenger.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  is_group BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE t_p33366711_burmalkord_messenger.chat_members (
  chat_id UUID REFERENCES t_p33366711_burmalkord_messenger.chats(id),
  user_id UUID REFERENCES t_p33366711_burmalkord_messenger.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE t_p33366711_burmalkord_messenger.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES t_p33366711_burmalkord_messenger.chats(id),
  sender_id UUID REFERENCES t_p33366711_burmalkord_messenger.users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bk_messages_chat ON t_p33366711_burmalkord_messenger.messages(chat_id);
CREATE INDEX idx_bk_chat_members_user ON t_p33366711_burmalkord_messenger.chat_members(user_id);

INSERT INTO t_p33366711_burmalkord_messenger.users (id, username, display_name, password_hash, avatar_color, status) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'alex', 'Алексей', 'hash_alex', '#5B8DEF', 'online'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'maria', 'Мария', 'hash_maria', '#E07BE0', 'online'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'ivan', 'Иван', 'hash_ivan', '#4CAF50', 'offline'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'kate', 'Катерина', 'hash_kate', '#FF9800', 'online'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'dmitry', 'Дмитрий', 'hash_dmitry', '#F44336', 'offline');

INSERT INTO t_p33366711_burmalkord_messenger.chats (id, is_group, name) VALUES
  ('b1b2c3d4-0001-0001-0001-000000000001', FALSE, NULL),
  ('b1b2c3d4-0002-0002-0002-000000000002', FALSE, NULL),
  ('b1b2c3d4-0003-0003-0003-000000000003', FALSE, NULL),
  ('b1b2c3d4-0004-0004-0004-000000000004', TRUE, 'Команда БурмалКорд');

INSERT INTO t_p33366711_burmalkord_messenger.chat_members (chat_id, user_id) VALUES
  ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001'),
  ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002'),
  ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001'),
  ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0003-0003-0003-000000000003'),
  ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0001-0001-0001-000000000001'),
  ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0004-0004-0004-000000000004'),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0001-0001-0001-000000000001'),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0002-0002-0002-000000000002'),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0003-0003-0003-000000000003'),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0004-0004-0004-000000000004'),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0005-0005-0005-000000000005');

INSERT INTO t_p33366711_burmalkord_messenger.messages (chat_id, sender_id, content, is_read, created_at) VALUES
  ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002', 'Привет! Как дела?', TRUE, NOW() - INTERVAL '2 hours'),
  ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Всё отлично! Работаю над проектом.', TRUE, NOW() - INTERVAL '110 minutes'),
  ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0002-0002-0002-000000000002', 'Звучит интересно!', TRUE, NOW() - INTERVAL '100 minutes'),
  ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Мессенджер БурмалКорд!', FALSE, NOW() - INTERVAL '30 minutes'),
  ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0003-0003-0003-000000000003', 'Видел новое обновление?', TRUE, NOW() - INTERVAL '3 hours'),
  ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001', 'Да, выглядит круто!', TRUE, NOW() - INTERVAL '150 minutes'),
  ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0003-0003-0003-000000000003', 'Встречаемся завтра?', FALSE, NOW() - INTERVAL '1 hour'),
  ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0004-0004-0004-000000000004', 'Ты свободна сегодня?', TRUE, NOW() - INTERVAL '5 hours'),
  ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0001-0001-0001-000000000001', 'Да, в 7 вечера!', TRUE, NOW() - INTERVAL '4 hours'),
  ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0004-0004-0004-000000000004', 'Договорились!', FALSE, NOW() - INTERVAL '210 minutes'),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0001-0001-0001-000000000001', 'Всем привет в чате!', TRUE, NOW() - INTERVAL '1440 minutes'),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0002-0002-0002-000000000002', 'Рады всех видеть!', TRUE, NOW() - INTERVAL '1380 minutes'),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0003-0003-0003-000000000003', 'Когда следующий созвон?', TRUE, NOW() - INTERVAL '1320 minutes'),
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0004-0004-0004-000000000004', 'В пятницу в 15:00 по МСК', FALSE, NOW() - INTERVAL '10 minutes');
