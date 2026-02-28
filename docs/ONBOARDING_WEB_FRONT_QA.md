# QA Pass: Onboarding Web Frontend

Дата: 2026-02-28

## Реализованные маршруты

- `/onboarding` — выбор типа профиля.
- `/onboarding/athlete` — форма создания профиля атлета.
- `/onboarding/influencer` — форма создания профиля инфлюэнсера.

## Проверенные сценарии

1. Новый пользователь после логина:

- Вызывается `/v1/me`.
- При `requiresAthleteProfile` или `requiresInfluencerProfile` выполняется редирект на `/onboarding`.

2. Создание профиля атлета:

- Отправляется `POST /v1/athlete/profile`.
- При успехе выполняется refresh `/v1/me` и редирект на `/athlete`.
- Для `403` показано сообщение: «Недостаточно прав для создания профиля.»

3. Создание профиля инфлюэнсера:

- Отправляется `POST /v1/influencer/profile`.
- При успехе выполняется refresh `/v1/me` и редирект на `/influencer/programs`.
- Если endpoint недоступен, показано сообщение: «Создание профиля инфлюэнсера не поддержано сервером».

4. Ручной доступ к onboarding:

- Добавлена кнопка «Открыть onboarding» на странице профиля инфлюэнсера.

## Техническая валидация

- `npm run lint` — passed (есть только существующие warning по media `<img>`).
- `npm run typecheck` — passed.
- `npm run build` — passed.
