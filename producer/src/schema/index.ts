import { z } from "zod";

export const notificationSchema = z.object({
  userId: z.string().min(1),
  eventType: z.enum([
    "AUTH_OTP",
    "LOGIN_ALERT",
    "NEWSLETTER"
  ]),
  sender: z.string(),
  reciever: z.string(),
  data: z.record(z.string(), z.any()),
  channels: z.array(z.enum(["email", "sms", "whatsapp", "push"])).optional(),
  priority: z.enum(["high", "medium", "low"]).optional()
});
