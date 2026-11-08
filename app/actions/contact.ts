"use server";

import nodemailer from "nodemailer";
import {
  TOPIC_IDS,
  type ContactErrors,
  type ContactState,
  type ContactValues,
  type TopicId,
} from "@/components/contact/state";
import { dictionaries } from "@/lib/i18n";

/* Envía el formulario de contacto por SMTP.
   Variables de entorno (se configuran en Dokploy, pestaña Environment):
   SMTP_HOST, SMTP_PORT (465 o 587), SMTP_USER, SMTP_PASS,
   CONTACT_TO (a dónde llegan los mensajes) y CONTACT_FROM (opcional). */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function read(formData: FormData, name: string, max: number) {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, max);
}

export async function sendContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Campo trampa: las personas no lo ven, los bots lo rellenan.
  if (read(formData, "sitio_web", 200)) {
    return { status: "success", correo: "" };
  }

  const values: ContactValues = {
    nombre: read(formData, "nombre", 120).replace(/[\r\n]+/g, " "),
    correo: read(formData, "correo", 200),
    tema: read(formData, "tema", 80),
    mensaje: read(formData, "mensaje", 5000),
  };

  const errors: ContactErrors = {};
  if ((values.nombre ?? "").length < 2) errors.nombre = true;
  if (!EMAIL.test(values.correo ?? "")) errors.correo = true;
  if (!TOPIC_IDS.includes(values.tema as TopicId)) errors.tema = true;
  if ((values.mensaje ?? "").length < 20) errors.mensaje = true;

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors, values };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    return { status: "unavailable", values };
  }

  const port = Number(SMTP_PORT ?? 465);
  // El correo me llega siempre en español, con el idioma del visitante anotado.
  const topic = dictionaries.es.contact.topics[values.tema as TopicId];
  const lang = read(formData, "lang", 4) === "en" ? "inglés" : "español";

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transport.sendMail({
      from: CONTACT_FROM || SMTP_USER,
      to: CONTACT_TO,
      replyTo: { name: values.nombre ?? "", address: values.correo ?? "" },
      subject: `lexpy.cloud: ${topic}, de ${values.nombre}`,
      text: [
        `Nombre: ${values.nombre}`,
        `Correo: ${values.correo}`,
        `Tipo de proyecto: ${topic}`,
        `Idioma del sitio: ${lang}`,
        "",
        values.mensaje,
      ].join("\n"),
    });

    return { status: "success", correo: values.correo ?? "" };
  } catch (error) {
    console.error("[contacto] no se pudo enviar el correo:", error);
    return { status: "error", values };
  }
}
