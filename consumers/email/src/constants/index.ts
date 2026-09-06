import dotenv from "dotenv";
import { EmailTemplate } from "../types";

dotenv.config();

export const QUEUE_URL = process.env.QUEUE_URL!;
export const SES_EMAIL = process.env.SES_EMAIL!;




