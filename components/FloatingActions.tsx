"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import logo from "@/public/brand/logo-lineas-negras.png";
import { GITHUB_URL } from "@/lib/github-config";
import { useI18n } from "@/components/i18n/I18nProvider";

/* Asistente con respuestas automáticas: solo responde con lo que ya dice
   la web. Lo que no sabe lo deriva al formulario de contacto. */

interface Action {
  label: string;
  href: string;
  external?: boolean;
}

type AnswerId = "servicios" | "stack" | "empezar" | "infra" | "codigo";

interface Answer {
  id: AnswerId;
  keywords: string[];
  href?: string;
  external?: boolean;
}

/* Palabras clave en español e inglés; el texto de cada respuesta viene del idioma activo. */
const ANSWERS: Answer[] = [
  {
    id: "servicios",
    keywords: ["servicio", "ofreces", "haces", "dedicas", "ayuda", "web", "app", "api", "automatiz", "devops", "consultor", "service", "offer", "help", "automation", "consulting"],
    href: "#servicios",
  },
  {
    id: "stack",
    keywords: ["tecnolog", "stack", "lenguaje", "next", "react", "typescript", "docker", "postgres", "redis", "cloudflare", "framework", "technolog", "language", "tools"],
  },
  {
    id: "empezar",
    keywords: ["empez", "comenz", "inici", "contrat", "proyecto", "cotiz", "presupuesto", "precio", "costo", "cuanto", "contact", "correo", "hablar", "start", "begin", "hire", "project", "quote", "price", "cost", "budget", "email", "talk"],
    href: "#contacto",
  },
  {
    id: "infra",
    keywords: ["aloja", "hosting", "servidor", "vps", "despleg", "deploy", "nube", "infraestructura", "dokploy", "host", "server", "cloud", "infrastructure"],
  },
  {
    id: "codigo",
    keywords: ["codigo", "github", "repositorio", "repo", "portafolio", "ejemplo", "trabajos", "code", "portfolio", "example", "work"],
    href: GITHUB_URL,
    external: true,
  },
];

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  action?: Action;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function findAnswer(input: string) {
  const query = normalize(input);
  let best: Answer | null = null;
  let bestScore = 0;
  for (const answer of ANSWERS) {
    const score = answer.keywords.filter((k) => query.includes(k)).length;
    if (score > bestScore) {
      best = answer;
      bestScore = score;
    }
  }
  return best;
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12.5a7.5 7.5 0 0 1-10.9 6.7L4 20.5l1.4-4.6A7.5 7.5 0 1 1 20 12.5z" />
      <path d="M8.5 12.5h.01M12.5 12.5h.01M16.5 12.5h.01" strokeWidth="2.6" />
    </svg>
  );
}

function ActionLink({ action, onNavigate }: { action: Action; onNavigate: () => void }) {
  return (
    <a
      href={action.href}
      onClick={action.external ? undefined : onNavigate}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noopener noreferrer" : undefined}
      className="mt-2.5 inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13.5px] font-semibold text-on-ink transition-opacity duration-[var(--dur-short)] hover:opacity-85"
    >
      {action.label}
    </a>
  );
}

const roundButton =
  "grid h-[52px] w-[52px] place-items-center rounded-full shadow-[0_6px_20px_-6px_oklch(20%_0.01_265/0.45)] ring-1 transition-[opacity,transform] duration-[var(--dur-short)] hover:-translate-y-0.5";

export default function FloatingActions() {
  const t = useI18n().t.chat;
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: t.greeting },
  ]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const panelId = useId();
  const chatButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        chatButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, typing]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function replyFor(answer: Answer | null): { text: string; action?: Action } {
    if (!answer) return { text: t.fallback, action: { label: t.goToForm, href: "#contacto" } };
    const copy = t.answers[answer.id];
    return {
      text: copy.text,
      action: answer.href ? { label: copy.action, href: answer.href, external: answer.external } : undefined,
    };
  }

  function ask(text: string, answer: Answer | null) {
    if (typing) return;
    const reply = replyFor(answer);
    setMessages((list) => [...list, { id: nextId.current++, from: "user", text }]);
    setTyping(true);
    timer.current = setTimeout(() => {
      setTyping(false);
      setMessages((list) => [
        ...list,
        { id: nextId.current++, from: "bot", text: reply.text, action: reply.action },
      ]);
    }, 450);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    ask(text, findAnswer(text));
  }

  function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  const asked = new Set(
    messages.filter((m) => m.from === "user").map((m) => m.text),
  );
  const suggestions = ANSWERS.filter((a) => !asked.has(t.answers[a.id].question));

  return (
    <>
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={t.name}
          className="a-rise fixed right-4 bottom-[84px] z-[60] flex h-[min(540px,calc(100svh-120px))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[22px] border border-rule bg-paper-2 text-ink shadow-[0_24px_60px_-20px_oklch(20%_0.01_265/0.45)] [animation-duration:220ms] sm:right-6 sm:bottom-[92px]"
        >
          <header className="flex items-center gap-3 border-b border-rule px-4 py-3.5">
            <Image src={logo} alt="" width={36} height={36} className="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">{t.name}</p>
              <p className="text-[12.5px] text-muted">{t.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                chatButtonRef.current?.focus();
              }}
              aria-label={t.close}
              className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors duration-[var(--dur-short)] hover:bg-paper-3"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className={message.from === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] rounded-[16px] px-3.5 py-2.5 text-[14.5px] leading-snug ${
                    message.from === "user"
                      ? "rounded-br-[6px] bg-ink text-on-ink"
                      : "rounded-bl-[6px] bg-paper text-ink"
                  }`}
                >
                  {message.text}
                  {message.action ? (
                    <div>
                      <ActionLink action={message.action} onNavigate={() => setOpen(false)} />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {typing ? (
              <p className="text-[13px] text-muted">
                {t.typing}
              </p>
            ) : null}
          </div>

          {suggestions.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto px-4 pb-3">
              {suggestions.map((answer) => (
                <button
                  key={answer.id}
                  type="button"
                  onClick={() => ask(t.answers[answer.id].question, answer)}
                  disabled={typing}
                  className="shrink-0 rounded-full border border-rule bg-paper px-3 py-1.5 text-[13px] text-ink transition-colors duration-[var(--dur-short)] hover:border-muted disabled:opacity-55"
                >
                  {t.answers[answer.id].question}
                </button>
              ))}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-rule p-3">
            <label htmlFor={`${panelId}-entrada`} className="sr-only">
              {t.inputLabel}
            </label>
            <input
              ref={inputRef}
              id={`${panelId}-entrada`}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t.inputLabel}
              autoComplete="off"
              maxLength={300}
              className="h-11 min-w-0 flex-1 rounded-full border border-rule bg-paper px-4 text-[16px] text-ink placeholder:text-muted/80 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ink"
            />
            <button
              type="submit"
              aria-label={t.send}
              disabled={typing || !draft.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-on-ink transition-opacity duration-[var(--dur-short)] disabled:opacity-40"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none">
                <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      ) : null}

      <div className="fixed right-4 bottom-4 z-[60] flex flex-col items-center gap-3 sm:right-6 sm:bottom-6">
        {showTop && !open ? (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label={t.backToTop}
            className={`a-pop ${roundButton} bg-paper-2 text-ink ring-rule`}
          >
            <svg viewBox="0 0 16 16" aria-hidden className="h-[18px] w-[18px]" fill="none">
              <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}

        <button
          ref={chatButtonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={open ? t.close : t.open}
          className={`${roundButton} bg-ink text-on-ink ring-on-ink/30`}
        >
          {open ? (
            <svg viewBox="0 0 16 16" aria-hidden className="h-[18px] w-[18px]" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <ChatIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
}
