import { OTP_DATA } from "../types";

export const AUTH_OTP_SMS_TEMPLATE = {
  id: "auth_otp_sms",

  render: (variables: OTP_DATA | Record<string, string | number>) => {
    return `Your ${variables.service} verification code is ${variables.otp}.
It is valid for ${variables.expiresIn} minutes.
Do not share this code with anyone.`;
  },
};
