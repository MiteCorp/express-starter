import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (payload: {
  to: string;
  subject: string;
  body: string;
  body_type?: "html" | "text";
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    
  });

  let mail_config: any = {
    from: process.env.SMTP_FROM + " <" + process.env.MAIL_FROM_ADDRESS + ">",
    to: payload.to,
    subject: payload.subject,
  };

  if (payload.body_type === "html") {
    mail_config = {
      ...mail_config,
      html: payload.body,
    };
  } else {
    mail_config = {
      ...mail_config,
      text: payload.body,
    };
  }

  const info = await transporter.sendMail(mail_config);
  console.log("Message sent: %s", info.messageId);

  return info;
};

export default sendEmail;