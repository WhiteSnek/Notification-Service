import { twilioClient } from "../config/twilio.config"

export const sendSMS = async () => {
    const message = await twilioClient.messages.create({
        body: "TEST MESSAGE",
        from: process.env.TWILIO_PHONE_NO,
        to: "+18777804236"
    })

    console.log(message)
}