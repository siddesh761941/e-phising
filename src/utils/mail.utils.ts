import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "securefromphising@gmail.com",
    pass: "xvgvrgmclwsbnszr" //"hbysvumgqwbdxbqd"
  }
});

export const sendTemporaryPassword = async (email: string, pwd: string) => {
  const mailOptions = {
    from: "securefromphising@gmail.com",
    subject: "Temproary Password",
    text: `Your temproary password is ${pwd}`,
    to: email
  };

  try {
    await transport.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
