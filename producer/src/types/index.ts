export interface Notification {
  userId: string;
  clientId: string;
  reciever: string;
  eventType: "AUTH_OTP" | "LOGIN_ALERT" | "NEWSLETTER";
  data: DataType;
  channels: ("email" | "sms" | "whatsapp" | "push")[];
  priority: "high" | "medium" | "low";
}

export interface DataType<T = Record<string, any>> {
  variables: T
}
