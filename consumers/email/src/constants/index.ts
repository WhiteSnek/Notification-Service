import dotenv from "dotenv";
import { EmailTemplate } from "../types";
import path from "path";

dotenv.config();

export const QUEUE_URL = process.env.QUEUE_URL!;
export const SES_EMAIL = process.env.SES_EMAIL!;

export const EMAIL_SUBJECT_MAP: Record<EmailTemplate, string> = {
  auth_otp: "Your One-Time Password (OTP)",
  login_alert: "New Login Detected on Your Account",
  password_reset: "Reset Your Password",
  newsletter: "Latest Updates From Our Team",
};

export const TEMPLATE_DIR = path.join(__dirname, "..", "templates");

export const EVENT_TO_EMAIL_TEMPLATE = {
  AUTH_OTP: "auth_otp",
  LOGIN_ALERT: "login_alert",
  NEWSLETTER: "newsletter",
  PASSWORD_RESET: "password_reset"
} as const;
