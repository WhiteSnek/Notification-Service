import { twilioClient } from "../config/twilio.config"
import { EVENT_TO_SMS_TEMPLATE } from "../constants";
import { NotificationEventType, SMS_DATA } from "../types"

export const sendSMS = async (eventType: NotificationEventType,reciever: string, data: SMS_DATA) => {
    const { variables } = data;
    const template = EVENT_TO_SMS_TEMPLATE[eventType as keyof typeof EVENT_TO_SMS_TEMPLATE]
    if (!template) {
        throw new Error(`No SMS template found for event: ${eventType}`);
    }
    const smsText = template.render(variables)
    const message = await twilioClient.messages.create({
        body: smsText,
        from: process.env.TWILIO_PHONE_NO,
        to: reciever
    })

    console.log(message)
}