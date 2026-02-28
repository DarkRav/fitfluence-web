# QA Pass: Onboarding Path A

Дата: 2026-02-28

## Покрытые сценарии

- Self-registration через Keycloak из экрана логина (`Создать аккаунт`).
- После авторизации выполняется bootstrap через `GET /v1/me`.
- При `requiresInfluencerProfile` / `requiresAthleteProfile` пользователь перенаправляется на `/onboarding`.
- Создание профиля через:
  - `POST /v1/influencer/profile`
  - `POST /v1/athlete/profile`
- При `409` onboarding продолжает flow через повторный `GET /v1/me`.
- После завершения onboarding:
  - `ADMIN` -> `/admin/programs`
  - `INFLUENCER` -> `/influencer/programs`
  - `ATHLETE` -> `/athlete` (русская заглушка + кнопка выхода)

## Техническая валидация

- `npm run lint` — passed (только существующие warning по media `<img>`).
- `npm run typecheck` — passed.
- `npm run build` — passed.

## Примечания

- Формы onboarding соответствуют полям OpenAPI `CreateAthleteProfileRequest` и `CreateInfluencerProfileRequest`.
- В UI onboarding отсутствуют прямые импорты `api/gen`; используются только wrapper-слои из `src/api`.
