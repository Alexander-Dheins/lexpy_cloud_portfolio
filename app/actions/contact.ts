"use server";

import nodemailer from "nodemailer";
import {
  TOPICS,
  type ContactState,
  type ContactValues,
} from "@/components/contact/state";

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

  const errors: ContactValues = {};
  if ((values.nombre ?? "").length < 2) errors.nombre = "Escribe tu nombre.";
  if (!EMAIL.test(values.correo ?? ""))
    errors.correo = "Revisa el correo, parece incompleto.";
  if (!TOPICS.includes(values.tema ?? ""))
    errors.tema = "Elige el tipo de proyecto.";
  if ((values.mensaje ?? "").length < 20)
    errors.mensaje = "Cuéntame un poco más, al menos 20 caracteres.";

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors, values };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    return { status: "unavailable", values };
  }

  const port = Number(SMTP_PORT ?? 465);

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
      subject: `lexpy.cloud: ${values.tema}, de ${values.nombre}`,
      text: [
        `Nombre: ${values.nombre}`,
        `Correo: ${values.correo}`,
        `Tipo de proyecto: ${values.tema}`,
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
