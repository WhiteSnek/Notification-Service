import dotenv from "dotenv";

dotenv.config();

export const QUEUE_URL = process.env.QUEUE_URL!;

import { AUTH_OTP_SMS_TEMPLATE } from "../templates/auth_otp";

export const EVENT_TO_SMS_TEMPLATE = {
  AUTH_OTP: AUTH_OTP_SMS_TEMPLATE,
} as const;
