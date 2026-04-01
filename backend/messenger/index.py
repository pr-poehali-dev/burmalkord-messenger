import json
import os
import psycopg
from urllib.parse import parse_qs

DB_URL = os.environ.get("DATABASE_URL", "")
SCHEMA = "t_p33366711_burmalkord_messenger"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
}


def get_conn():
    return psycopg.connect(DB_URL)


def json_resp(data, status=200):
    return {
        "statusCode": status,
        "headers": CORS_HEADERS,
        "body": json.dumps(data, default=str),
    }


def handler(request, context):
    print(f"REQUEST TYPE: {type(request)}, VALUE: {repr(request)[:300]}")
    # request - список [method, path, headers, body] или dict
    if isinstance(request, list):
        method = (request[0] if len(request) > 0 else "GET").upper()
        full_path = request[1] if len(request) > 1 else "/"
        raw_body = request[3] if len(request) > 3 else ""
        if "?" in full_path:
            path, qs_raw = full_path.split("?", 1)
        else:
            path = full_path
            qs_raw = ""
    elif isinstance(request, dict):
        method = request.get("method", request.get("httpMethod", "GET")).upper()
        full_path = request.get("path", request.get("rawPath", "/"))
        raw_body = request.get("body", "")
        if "?" in full_path:
            path, qs_raw = full_path.split("?", 1)
        else:
            path = full_path
            qs_raw = request.get("queryString", request.get("rawQueryString", ""))
    else:
        method = getattr(request, "method", "GET").upper()
        full_path = getattr(request, "path", "/")
        raw_body = getattr(request, "body", "")
        if "?" in full_path:
            path, qs_raw = full_path.split("?", 1)
        else:
            path = full_path
            qs_raw = getattr(request, "queryString", "")

    qs = parse_qs(qs_raw) if qs_raw else {}

    body = {}
    if raw_body:
        try:
            body = json.loads(raw_body)
        except Exception:
            body = {}

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    try:
        # GET /users
        if method == "GET" and path in ("/users", "/messenger/users"):
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        f"SELECT id, username, display_name, avatar_color, status, last_seen FROM {SCHEMA}.users ORDER BY display_name"
                    )
                    cols = [d[0] for d in cur.description]
                    rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return json_resp({"users": rows})

        # POST /login
        if method == "POST" and path in ("/login", "/messenger/login"):
            username = body.get("username", "").lower().strip()
            if not username:
                return json_resp({"error": "Нужен username"}, 400)
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        f"SELECT id, username, display_name, avatar_color, status FROM {SCHEMA}.users WHERE username = %s",
                        (username,),
                    )
                    row = cur.fetchone()
                    if not row:
                        return json_resp({"error": "Пользователь не найден"}, 404)
                    cols = [d[0] for d in cur.description]
                    user = dict(zip(cols, row))
            return json_resp({"user": user})

        # POST /register
        if method == "POST" and path in ("/register", "/messenger/register"):
            username = body.get("username", "").lower().strip()
            display_name = body.get("display_name", "").strip()
            if not username or not display_name:
                return json_resp({"error": "Нужны username и display_name"}, 400)
            import random
            colors = ["#5B8DEF", "#E07BE0", "#4CAF50", "#FF9800", "#F44336", "#00BCD4", "#9C27B0"]
            color = random.choice(colors)
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE username = %s", (username,))
                    if cur.fetchone():
                        return json_resp({"error": "Имя пользователя занято"}, 409)
                    cur.execute(
                        f"""INSERT INTO {SCHEMA}.users (username, display_name, password_hash, avatar_color, status)
                            VALUES (%s, %s, 'hash', %s, 'online')
                            RETURNING id, username, display_name, avatar_color, status""",
                        (username, display_name, color),
                    )
                    cols = [d[0] for d in cur.description]
                    user = dict(zip(cols, cur.fetchone()))
                conn.commit()
            return json_resp({"user": user})

        # GET /chats
        if method == "GET" and path in ("/chats", "/messenger/chats"):
            user_id = qs.get("user_id", [None])[0]
            if not user_id:
                return json_resp({"error": "Нужен user_id"}, 400)
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        f"""SELECT
                            c.id, c.name, c.is_group, c.created_at,
                            (SELECT m.content FROM {SCHEMA}.messages m WHERE m.chat_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
                            (SELECT m.created_at FROM {SCHEMA}.messages m WHERE m.chat_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message_at,
                            (SELECT u.display_name FROM {SCHEMA}.users u JOIN {SCHEMA}.chat_members cm2 ON cm2.user_id = u.id WHERE cm2.chat_id = c.id AND u.id::text != %s LIMIT 1) as other_user_name,
                            (SELECT u.avatar_color FROM {SCHEMA}.users u JOIN {SCHEMA}.chat_members cm2 ON cm2.user_id = u.id WHERE cm2.chat_id = c.id AND u.id::text != %s LIMIT 1) as other_user_color,
                            (SELECT u.status FROM {SCHEMA}.users u JOIN {SCHEMA}.chat_members cm2 ON cm2.user_id = u.id WHERE cm2.chat_id = c.id AND u.id::text != %s LIMIT 1) as other_user_status,
                            (SELECT u.id FROM {SCHEMA}.users u JOIN {SCHEMA}.chat_members cm2 ON cm2.user_id = u.id WHERE cm2.chat_id = c.id AND u.id::text != %s LIMIT 1) as other_user_id,
                            (SELECT COUNT(*) FROM {SCHEMA}.messages m WHERE m.chat_id = c.id AND m.is_read = FALSE AND m.sender_id::text != %s) as unread_count
                        FROM {SCHEMA}.chats c
                        JOIN {SCHEMA}.chat_members cm ON cm.chat_id = c.id
                        WHERE cm.user_id::text = %s
                        ORDER BY last_message_at DESC NULLS LAST""",
                        (user_id, user_id, user_id, user_id, user_id, user_id),
                    )
                    cols = [d[0] for d in cur.description]
                    rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return json_resp({"chats": rows})

        # GET /messages
        if method == "GET" and path in ("/messages", "/messenger/messages"):
            chat_id = qs.get("chat_id", [None])[0]
            user_id = qs.get("user_id", [None])[0]
            if not chat_id:
                return json_resp({"error": "Нужен chat_id"}, 400)
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        f"""SELECT m.id, m.chat_id, m.content, m.is_read, m.created_at,
                            m.sender_id, u.display_name as sender_name, u.avatar_color as sender_color
                        FROM {SCHEMA}.messages m
                        JOIN {SCHEMA}.users u ON u.id = m.sender_id
                        WHERE m.chat_id::text = %s
                        ORDER BY m.created_at ASC""",
                        (chat_id,),
                    )
                    cols = [d[0] for d in cur.description]
                    rows = [dict(zip(cols, r)) for r in cur.fetchall()]
                if user_id:
                    with conn.cursor() as cur:
                        cur.execute(
                            f"UPDATE {SCHEMA}.messages SET is_read = TRUE WHERE chat_id::text = %s AND sender_id::text != %s AND is_read = FALSE",
                            (chat_id, user_id),
                        )
                conn.commit()
            return json_resp({"messages": rows})

        # POST /messages
        if method == "POST" and path in ("/messages", "/messenger/messages"):
            chat_id = body.get("chat_id")
            sender_id = body.get("sender_id")
            content = body.get("content", "").strip()
            if not chat_id or not sender_id or not content:
                return json_resp({"error": "Нужны chat_id, sender_id, content"}, 400)
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        f"""INSERT INTO {SCHEMA}.messages (chat_id, sender_id, content, is_read)
                            VALUES (%s::uuid, %s::uuid, %s, FALSE)
                            RETURNING id, chat_id, sender_id, content, is_read, created_at""",
                        (chat_id, sender_id, content),
                    )
                    cols = [d[0] for d in cur.description]
                    msg = dict(zip(cols, cur.fetchone()))
                    cur.execute(
                        f"SELECT display_name, avatar_color FROM {SCHEMA}.users WHERE id::text = %s",
                        (sender_id,),
                    )
                    user_row = cur.fetchone()
                conn.commit()
            if user_row:
                msg["sender_name"] = user_row[0]
                msg["sender_color"] = user_row[1]
            return json_resp({"message": msg})

        # POST /chats/create
        if method == "POST" and path in ("/chats/create", "/messenger/chats/create"):
            u1 = body.get("user1_id")
            u2 = body.get("user2_id")
            if not u1 or not u2:
                return json_resp({"error": "Нужны user1_id и user2_id"}, 400)
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        f"""SELECT c.id FROM {SCHEMA}.chats c
                            JOIN {SCHEMA}.chat_members cm1 ON cm1.chat_id = c.id AND cm1.user_id::text = %s
                            JOIN {SCHEMA}.chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id::text = %s
                            WHERE c.is_group = FALSE""",
                        (u1, u2),
                    )
                    row = cur.fetchone()
                    if row:
                        return json_resp({"chat_id": str(row[0])})
                    cur.execute(f"INSERT INTO {SCHEMA}.chats (is_group) VALUES (FALSE) RETURNING id")
                    chat_id = cur.fetchone()[0]
                    cur.execute(
                        f"INSERT INTO {SCHEMA}.chat_members (chat_id, user_id) VALUES (%s::uuid, %s::uuid), (%s::uuid, %s::uuid)",
                        (chat_id, u1, chat_id, u2),
                    )
                conn.commit()
            return json_resp({"chat_id": str(chat_id)})

        # PUT /users/status
        if method == "PUT" and path in ("/users/status", "/messenger/users/status"):
            user_id = body.get("user_id")
            status = body.get("status")
            if not user_id or not status:
                return json_resp({"error": "Нужны user_id и status"}, 400)
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        f"UPDATE {SCHEMA}.users SET status = %s, last_seen = NOW() WHERE id::text = %s",
                        (status, user_id),
                    )
                conn.commit()
            return json_resp({"success": True})

        # Debug info
        return json_resp({"error": "Маршрут не найден", "path": path, "method": method}, 404)

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return json_resp({"error": str(e)}, 500)