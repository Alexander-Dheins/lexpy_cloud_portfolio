"use client";

import dynamic from "next/dynamic";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { sendContact } from "@/app/actions/contact";
import {
  TOPICS,
  initialContactState,
  type ContactField,
  type ContactValues,
} from "./contact/state";

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
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const values: ContactValues = "values" in state ? state.values : {};
  const errors: ContactValues = state.status === "invalid" ? state.errors : {};

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
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field id={id("nombre")} label="Nombre" error={errors.nombre}>
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
        <Field id={id("correo")} label="Correo" error={errors.correo}>
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

      <Field id={id("tema")} label="Tipo de proyecto" error={errors.tema}>
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
              Elige una opción
            </option>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
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

      <Field id={id("mensaje")} label="Qué necesitas" error={errors.mensaje}>
        <textarea
          id={id("mensaje")}
          name="mensaje"
          rows={6}
          required
          defaultValue={values.mensaje}
          placeholder="Qué quieres lograr, para cuándo y qué sistemas usas hoy."
          aria-invalid={Boolean(errors.mensaje)}
          aria-describedby={describe("mensaje")}
          className={`${inputBase} resize-y py-3 leading-relaxed`}
        />
      </Field>

      {/* Campo trampa para bots: oculto a personas y lectores de pantalla. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("sitio")}>No completar</label>
        <input id={id("sitio")} name="sitio_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-2 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13.5px] text-muted">
          Tus datos solo se usan para responderte.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-on-ink transition-opacity duration-[var(--dur-short)] hover:opacity-85 disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Enviando…" : "Enviar mensaje"}
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-4 text-[14.5px] text-ink empty:hidden">
        {state.status === "unavailable"
          ? "El formulario todavía no está conectado al correo. Inténtalo más tarde."
          : state.status === "error"
            ? "No se pudo enviar el mensaje. Intenta de nuevo en unos minutos."
            : ""}
      </p>
    </form>
  );
}

export default function Contact() {
  const [round, setRound] = useState(0);
  const [sentTo, setSentTo] = useState<string | null>(null);

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="container-page pt-12 pb-28 sm:pb-36">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
        <div className="stage-matte relative h-[340px] overflow-hidden rounded-[22px] sm:h-[420px] lg:col-span-5 lg:h-auto">
          <WinterScene />
          <p className="pointer-events-none absolute bottom-5 left-6 text-[13px] text-panel-muted">
            Escena en Three.js, renderizada en tu navegador.
          </p>
        </div>

        <div className="rounded-[22px] bg-paper-2 p-6 sm:p-9 lg:col-span-7">
          <h2
            id="contacto-titulo"
            className="text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.03em]"
          >
            Cuéntame qué quieres construir
          </h2>
          <p className="mt-3 mb-8 max-w-[46ch] text-[16px] leading-relaxed text-muted">
            Leo cada mensaje y respondo al correo que dejes.
          </p>
          {sentTo !== null ? (
            <div role="status" className="flex min-h-[360px] flex-col items-start justify-center">
              <p className="text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.02em]">
                Mensaje enviado.
              </p>
              <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-muted">
                {sentTo
                  ? `Te respondo a ${sentTo}. Revisa también la carpeta de spam por si acaso.`
                  : "Gracias por escribir."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSentTo(null);
                  setRound((r) => r + 1);
                }}
                className="mt-8 text-[15px] font-semibold text-ink underline decoration-rule decoration-2 underline-offset-[6px] transition-colors duration-[var(--dur-short)] hover:decoration-ink"
              >
                Enviar otro mensaje
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
