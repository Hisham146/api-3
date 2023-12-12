import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: subject,
      text: 
      `      Hey,
             Please click on the link below to verify it's you.

             Link: ${text}

             Thanks.
             Shampy MarketPlace.
             `,
    };
    
    // Send the email
    await transporter.sendMail(mailOptions);
   
   
  } catch (error) {
    
    return error;
  }
};

export default sendEmail;
