import type { SendMailOptions } from "nodemailer";
import { mailTransporter } from "../config/mail.js";

export const sendMail = async ({ to, subject, html }: SendMailOptions) => {
  const from = process.env.MAIL_FROM;
  if (!from) {
    throw new Error("Mail sender not configured");
  }

  await mailTransporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};
