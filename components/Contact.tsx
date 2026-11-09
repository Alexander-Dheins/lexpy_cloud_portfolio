"use client";

import dynamic from "next/dynamic";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { sendContact } from "@/app/actions/contact";
import {
  TOPIC_IDS,
  initialContactState,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "./contact/state";
import { useI18n } from "@/components/i18n/I18nProvider";

// WebGL solo existe en el navegador.
const WinterScene = dynamic(() => import("./contact/WinterScene"), { ssr: false });

const FIELD_ORDER: ContactField[] = ["nombre", "correo", "tema", "mensaje"];

const inputBase =
  "block w-full rounded-[12px] border border-rule bg-paper px-4 text-[16px] text-ink placeholder:text-muted/70 transition-colors duration-[var(--dur-short)] hover:border-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ink aria-[invalid=true]:border-ink";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 min-w-0">
      <label htmlFor={id} className="mb-2 block text-[14px] font-semibold text-ink">
        {label}
      </label>
      {children}
      <p id={`${id}-error`} className="mt-1.5 min-h-[1lh] text-[13.5px] text-ink">
        {error ?? ""}
      </p>
    </div>
  );
}

function ContactForm({ onSent }: { onSent: (correo: string) => void }) {
  const [state, action, pending] = useActionState(sendContact, initialContactState);
  const { lang, t: dict } = useI18n();
  const t = dict.contact;
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const values: ContactValues = "values" in state ? state.values : {};
  const flagged: ContactErrors = state.status === "invalid" ? state.errors : {};
  const errors: ContactValues = Object.fromEntries(
    Object.keys(flagged).map((field) => [field, t.errors[field as ContactField]]),
  );

  useEffect(() => {
    if (state.status === "success") {
      onSent(state.correo);
      return;
    }
    if (state.status === "invalid") {
      const first = FIELD_ORDER.find((field) => state.errors[field]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }, [state, onSent]);

  const id = (field: string) => `${uid}-${field}`;
  const describe = (field: ContactField) =>
    errors[field] ? `${id(field)}-error` : undefined;

  return (
    <form ref={formRef} action={action} noValidate className="relative">
      <input type="hidden" name="lang" value={lang} />
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field id={id("nombre")} label={t.name} error={errors.nombre}>
          <input
            id={id("nombre")}
            name="nombre"
            type="text"
            autoComplete="name"
            required
            defaultValue={values.nombre}
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={describe("nombre")}
            className={`${inputBase} h-12`}
          />
        </Field>
        <Field id={id("correo")} label={t.email} error={errors.correo}>
          <input
            id={id("correo")}
            name="correo"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            defaultValue={values.correo}
            aria-invalid={Boolean(errors.correo)}
            aria-describedby={describe("correo")}
            className={`${inputBase} h-12`}
          />
        </Field>
      </div>

      <Field id={id("tema")} label={t.topic} error={errors.tema}>
        <div className="relative">
          <select
            id={id("tema")}
            name="tema"
            required
            defaultValue={values.tema ?? ""}
            aria-invalid={Boolean(errors.tema)}
            aria-describedby={describe("tema")}
            className={`${inputBase} h-12 appearance-none pr-11`}
          >
            <option value="" disabled>
              {t.topicPlaceholder}
            </option>
            {TOPIC_IDS.map((topic) => (
              <option key={topic} value={topic}>
                {t.topics[topic]}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Field>

      <Field id={id("mensaje")} label={t.message} error={errors.mensaje}>
        <textarea
          id={id("mensaje")}
          name="mensaje"
          rows={6}
          required
          defaultValue={values.mensaje}
          placeholder={t.messagePlaceholder}
          aria-invalid={Boolean(errors.mensaje)}
          aria-describedby={describe("mensaje")}
          className={`${inputBase} resize-y py-3 leading-relaxed`}
        />
      </Field>

      {/* Campo trampa para bots: oculto a personas y lectores de pantalla. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("sitio")}>{t.honeypot}</label>
        <input id={id("sitio")} name="sitio_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-2 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13.5px] text-muted">
          {t.privacy}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-on-ink transition-opacity duration-[var(--dur-short)] hover:opacity-85 disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? t.sending : t.submit}
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-4 text-[14.5px] text-ink empty:hidden">
        {state.status === "unavailable"
          ? t.unavailable
          : state.status === "error"
            ? t.failed
            : ""}
      </p>
    </form>
  );
}

export default function Contact() {
  const t = useI18n().t.contact;
  const [round, setRound] = useState(0);
  const [sentTo, setSentTo] = useState<string | null>(null);

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="container-page pt-12 pb-28 sm:pb-36">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
        <div className="stage-matte relative h-[340px] overflow-hidden rounded-[22px] sm:h-[420px] lg:col-span-5 lg:h-auto">
          <WinterScene />
        </div>

        <div className="rounded-[22px] bg-paper-2 p-6 sm:p-9 lg:col-span-7">
          <h2
            id="contacto-titulo"
            className="mb-7 text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.03em]"
          >
            {t.title}
          </h2>
          {sentTo !== null ? (
            <div role="status" className="flex min-h-[360px] flex-col items-start justify-center">
              <p className="text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.02em]">
                {t.sentTitle}
              </p>
              <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-muted">
                {sentTo ? t.sentText(sentTo) : t.sentThanks}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSentTo(null);
                  setRound((r) => r + 1);
                }}
                className="mt-8 text-[15px] font-semibold text-ink underline decoration-rule decoration-2 underline-offset-[6px] transition-colors duration-[var(--dur-short)] hover:decoration-ink"
              >
                {t.another}
              </button>
            </div>
          ) : (
            <ContactForm key={round} onSent={setSentTo} />
          )}
        </div>
      </div>
    </section>
  );
}
