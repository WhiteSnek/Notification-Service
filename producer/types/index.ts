export interface Notification<T = Record<string, any>> {
  userId: string;
  clientId: string;
  sender: string;
  reciever: string;
  eventType: "AUTH_OTP" | "LOGIN_ALERT" | "NEWSLETTER";
  data: T;
  channels: ("email" | "sms" | "whatsapp" | "push")[];
  priority: "high" | "medium" | "low";
}
