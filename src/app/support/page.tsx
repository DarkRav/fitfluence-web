import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LifeBuoy, Mail, ShieldCheck } from "lucide-react";

const supportEmail = "fitfluence.support@gmail.com";

export const metadata: Metadata = {
  title: "Поддержка Fitfluence",
  description: "Помощь и поддержка пользователей приложения Fitfluence.",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground">
              F
            </span>
            Fitfluence
          </Link>
          <a
            href={`mailto:${supportEmail}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-secondary/40 bg-secondary/10 px-4 text-sm font-semibold text-secondary transition hover:bg-secondary/20"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Написать
          </a>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
              <LifeBuoy className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase text-secondary">Поддержка</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-foreground sm:text-5xl">
              Помощь по приложению Fitfluence
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Напишите нам, если не получается войти, запустить тренировку, синхронизировать
              прогресс или разобраться с планом тренировок.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${supportEmail}?subject=${encodeURIComponent("Поддержка Fitfluence")}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-gradient px-5 text-sm font-semibold text-primary-foreground shadow-card transition hover:brightness-105"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {supportEmail}
              </a>
              <a
                href="#before-contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-card"
              >
                Что указать в письме
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-foreground">Когда отвечаем</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Мы обрабатываем обращения по приложению и аккаунтам Fitfluence через электронную
              почту. Ответ придёт на адрес, с которого вы отправили сообщение.
            </p>
            <div className="mt-5 rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Email поддержки</p>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-1 block break-all text-sm text-secondary transition hover:text-secondary-hover"
              >
                {supportEmail}
              </a>
            </div>
          </aside>
        </section>

        <section id="before-contact" className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Вход и аккаунт",
              text: "Проблемы со входом через Apple, созданием профиля атлета или доступом к аккаунту.",
            },
            {
              title: "Тренировки",
              text: "Запуск тренировки, логирование подходов, весов, повторов, RPE и завершение сессии.",
            },
            {
              title: "Синхронизация",
              text: "Локальные данные, очередь синхронизации, история тренировок и прогресс.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <h2 className="text-2xl font-semibold text-foreground">Что указать в обращении</h2>
          <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <p className="rounded-xl border border-border bg-background p-4">
              Модель устройства и версия iOS.
            </p>
            <p className="rounded-xl border border-border bg-background p-4">
              Что вы пытались сделать и на каком экране возникла проблема.
            </p>
            <p className="rounded-xl border border-border bg-background p-4">
              Время возникновения ошибки и наличие подключения к интернету.
            </p>
            <p className="rounded-xl border border-border bg-background p-4">
              Скриншот или диагностический текст из раздела профиля, если он доступен.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
