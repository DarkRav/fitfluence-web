import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";

const supportEmail = "fitfluence.support@gmail.com";

export const metadata: Metadata = {
  title: "Политика конфиденциальности Fitfluence",
  description: "Политика конфиденциальности приложения Fitfluence.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <header>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground">
              F
            </span>
            Fitfluence
          </Link>

          <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold text-foreground sm:text-5xl">
            Политика конфиденциальности
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Дата обновления: 19 апреля 2026 г.</p>
        </header>

        <div className="mt-8 space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Какие данные мы обрабатываем
            </h2>
            <p className="mt-3">
              Fitfluence использует данные, необходимые для работы приложения: данные аккаунта,
              полученные через Sign in with Apple, профиль атлета, тренировочные планы, историю
              тренировок, упражнения, подходы, вес, повторы, RPE, отдых и сведения о синхронизации.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Для чего нужны данные</h2>
            <p className="mt-3">
              Эти данные используются для входа в приложение, отображения тренировок на сегодня,
              ведения тренировочного процесса, сохранения прогресса, синхронизации между устройством
              и сервером, а также для обработки обращений в поддержку.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Sign in with Apple</h2>
            <p className="mt-3">
              Для входа используется Sign in with Apple. Apple может передать приложению
              идентификатор пользователя, имя и email, если пользователь разрешил передачу этих
              данных. Мы используем их только для создания и обслуживания аккаунта Fitfluence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Локальное хранение и синхронизация
            </h2>
            <p className="mt-3">
              Часть данных может храниться на устройстве, чтобы приложение продолжало работать при
              нестабильном подключении. После восстановления соединения данные могут быть
              синхронизированы с сервером Fitfluence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Отслеживание и реклама</h2>
            <p className="mt-3">
              Fitfluence не использует данные для рекламного отслеживания пользователей между
              приложениями и сайтами других компаний.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Передача данных</h2>
            <p className="mt-3">
              Мы не продаём персональные данные. Данные могут обрабатываться техническими сервисами,
              которые обеспечивают работу приложения, авторизацию, хранение, синхронизацию и
              поддержку пользователей.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Удаление данных</h2>
            <p className="mt-3">
              Пользователь может запросить удаление аккаунта и связанных с ним данных, написав в
              поддержку Fitfluence с email, связанного с аккаунтом.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Контакты</h2>
            <p className="mt-3">
              По вопросам конфиденциальности, поддержки и удаления данных напишите нам:
            </p>
            <a
              href={`mailto:${supportEmail}?subject=${encodeURIComponent("Вопрос по конфиденциальности Fitfluence")}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-secondary/40 bg-secondary/10 px-4 py-3 font-semibold text-secondary transition hover:bg-secondary/20"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {supportEmail}
            </a>
          </section>
        </div>
      </article>
    </main>
  );
}
