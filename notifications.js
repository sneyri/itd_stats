import checkVerify from "./utils.js"
import fs from "fs";
import client from "./client.js";

// чуть чуть нейроночкой красиво сделал(

export default async function notifications() {
    const header = `
# УВЕДОМЛЕНИЯ ОТ ВЕРИФИЦИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ

---
`;
    let content = header;
    let limit = 1000;
    let offset = 0;
    let hasMore = true;
    let totalCount = 0;

    while (hasMore) {
        const result = await client.getNotifications(limit, offset);

        if (!result && !result.notifications) return;
        const notifications = result.notifications;

        for (let notify of notifications) {
            const actor = notify.actor;
            const username = actor.username;

            if (checkVerify(username)) {
                totalCount++;
                const date = new Date(notify.createdAt).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                let preview = notify.preview || 'без текста';
                if (preview.length > 150) {
                    preview = preview.slice(0, 150) + '...';
                }

                const typeEmoji = {
                    'like': '❤️',
                    'comment': '💬',
                    'repost': '🔄',
                    'mention': '👤',
                    'follow': '➕'
                };

                const emoji = typeEmoji[notify.type] || '📌';

                content += `
### ${emoji} ${notify.type.toUpperCase()}

**Пользователь:** @${username})
**Дата:** ${date}

> ${preview}

---
`;
            }
        }

        offset += limit;
        hasMore = result.hasMore;
    }

    const footer = `

## Статистика
**Всего уведомлений:** ${totalCount}

---
*Отчёт сгенерирован ${new Date().toLocaleString('ru-RU')}*
`;

    content += footer;

    fs.writeFileSync('./Stats/Notifications.md', content);
}