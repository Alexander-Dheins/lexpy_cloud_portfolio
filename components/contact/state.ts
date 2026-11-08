export type ContactField = "nombre" | "correo" | "tema" | "mensaje";

export type ContactValues = Partial<Record<ContactField, string>>;

/* Los errores viajan como campos marcados; el texto lo pone el idioma activo. */
export type ContactErrors = Partial<Record<ContactField, true>>;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors; values: ContactValues }
  | { status: "unavailable"; values: ContactValues }
  | { status: "error"; values: ContactValues }
  | { status: "success"; correo: string };

export const initialContactState: ContactState = { status: "idle" };

/* Los mismos servicios del árbol, para que el mensaje llegue clasificado. */
export const TOPIC_IDS = [
  "web",
  "api",
  "automatizacion",
  "consultoria",
  "infraestructura",
  "otro",
] as const;

export type TopicId = (typeof TOPIC_IDS)[number];
