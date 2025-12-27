export type EmailTemplate =
  | "auth_otp"
  | "login_alert"
  | "password_reset"
  | "newsletter";

export interface OTP_DATA {
  otp: string;
  expiresIn: string;
  service: string;
}

export type EmailTemplateVariablesMap = {
  auth_otp: OTP_DATA;
  login_alert: {
    device: string;
    location: string;
    time: string;
  };
  password_reset: {
    resetUrl: string;
    expiresIn: string;
  };
  newsletter: {
    title: string;
    content: string;
  };
};

export interface EMAIL_DATA<T extends EmailTemplate = EmailTemplate> {
  template: T;
  variables: EmailTemplateVariablesMap[T];
}
