# Lumiere

Онлайн-кінотеатр на базі Next.js та [The Movie Database (TMDB v3)](https://www.themoviedb.org/) API.
Огляд фільмів і серіалів, обрані, список перегляду, особисті оцінки користувача та підтримка двох мов (UA/EN).

## Технологічний стек

- Next.js 12 (Pages Router)
- TypeScript
- Firebase (Firestore) — зберігання користувацьких даних
- NextAuth — авторизація через Google
- Tailwind CSS — стилізація
- SWR — клієнтське кешування запитів
- next-seo — SEO-теги

## Можливості

- Перегляд популярних та трендових фільмів і серіалів
- Сторінки за жанрами
- Детальна сторінка з трейлером, акторським складом, режисером
- Рейтинг TMDB та власна оцінка користувача (1–10)
- Список улюбленого та список перегляду
- Перемикання мови інтерфейсу та контенту: українська / англійська
- Авторизація через Google

## Встановлення

```bash
yarn install
```

Створити файл `.env.local` у корені проєкту:

```env
TMDB_APIKEY=ваш_ключ_tmdb
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=довгий_випадковий_рядок
GOOGLE_CLIENT_ID=ваш_google_client_id
GOOGLE_CLIENT_SECRET=ваш_google_client_secret
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Запуск

- `yarn dev` — запуск у режимі розробки
- `yarn build` — продакшн збірка
- `yarn start` — запуск продакшн збірки

## Структура Firestore

```
users/{userId}/
  ├── favorites/{movie|tv-{id}}
  ├── watchlist/{movie|tv-{id}}
  └── ratings/{movie|tv-{id}}    ← { rating, ratedAt, ...mediaSnapshot }
```

## Ліцензія

MIT
