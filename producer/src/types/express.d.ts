import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      clientId?: string;
      channels?: ("email" | "sms" | "whatsapp" | "push")[];
    }
  }
}

export {};
