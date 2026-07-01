import checkVerify from "./utils.js";
import fs from "fs";
import client from "./client.js";

// Тут я через ИИшку сделал красивые уведомления, в падлу было самому. Вайбкод круглый год

export default async function notifications() {
    const header = `# Уведомления от верифицированных пользователей\n\n`;
    let content = header;
    let limit = 1000;
    let offset = 0;
    let hasMore = true;
    let totalCount = 0;

    const typeDescriptions = {
        'like': 'лайкнул(а) ваш пост',
        'comment': 'прокомментировал(а) ваш пост',
        'repost': 'репостнул(а) ваш пост',
        'mention': 'упомянул(а) вас',
        'follow': 'подписался(ась) на вас',
        'reply': 'ответил(а) вам',
    };

    while (hasMore) {
        const result = await client.getNotifications(limit, offset);

        if (!result || !result.notifications) return;
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

                const action = typeDescriptions[notify.type] || notify.type;

                content += `
@${username} ${action}

📅 **Дата:** ${date}
📝 **Текст:** ${preview}

---`;
            }
        }

        offset += limit;
        hasMore = result.hasMore;
    }

    content += `

## Статистика
👥 **Всего уведомлений от верифицированных пользователей:** ${totalCount}

---
📊 Отчёт сгенерирован ${new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`;

    // Сохраняем результат
    fs.writeFileSync('./Stats/Notifications.md', content);
}