import nodemailer from 'nodemailer';

export async function sendEmail(to: string, html: string){

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: 'yfdc3tkhynxnou2a@ethereal.email',
        pass: 'VKCGg6ffJTjUAZzd89',
      },
    });

    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to, // list of receivers
      subject: "Change Password", // Subject line
      html, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }

}