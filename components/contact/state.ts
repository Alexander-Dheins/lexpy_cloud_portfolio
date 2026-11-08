export type ContactField = "nombre" | "correo" | "tema" | "mensaje";

export type ContactValues = Partial<Record<ContactField, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactValues; values: ContactValues }
  | { status: "unavailable"; values: ContactValues }
  | { status: "error"; values: ContactValues }
  | { status: "success"; correo: string };

export const initialContactState: ContactState = { status: "idle" };

/* Los mismos servicios del árbol, para que el mensaje llegue clasificado. */
export const TOPICS = [
  "Desarrollo web y apps",
  "APIs e integraciones",
  "Automatización y DevOps",
  "Consultoría en digitalización",
  "Infraestructura",
  "Otro",
];
