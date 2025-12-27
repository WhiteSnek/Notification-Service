export interface Notification {
  userId: string;
  clientId: string;
  reciever: string;
  eventType: NotificationEventType;
  data: EMAIL_DATA;
  channels: ("email" | "sms" | "whatsapp" | "push")[];
  priority: "high" | "medium" | "low";
}

export interface EMAIL_DATA {
  variables: OTP_DATA | Record<string, string | number>;
}

export interface OTP_DATA {
  otp: number;
  expiresIn: string;
  service: string;
}

export type EmailTemplate =
  | "auth_otp"
  | "login_alert"
  | "password_reset"
  | "newsletter";

export type NotificationEventType =
  | "AUTH_OTP"
  | "LOGIN_ALERT"
  | "NEWSLETTER"
  | "PASSWORD_RESET";
