const nodemailer = require('nodemailer');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.BREVO_KEY,
  },
});

const sendVerificationEmail = (email, token) => {
  const mailOptions = {
    from: 'NodeChess <nodechess@contact.fr>',
    to: email,
    subject: 'Vérification de votre compte',
    html: `<h2>Bienvenue sur NodeChess</h2>
    <p>Veuillez cliquer sur le lien ici pour vérifier votre compte : <a href="http://149.202.52.182:8080/verify?token=${token}">J'active mon compte</a></p>
    <br>
    <img src="https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?resize=476%2C280&ssl=1" alt="gif">
    <br>
    <br>
    <p>Cordialement,</p>
    <p>L'équipe NodeChess</p>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
  });
}

const sendForgotPasswordEmail = (email, token) => {
  const mailOptions = {
    from: 'NodeChess <nodechess@contact.fr>',
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `<h2>Réinitialisation de votre mot de passe</h2>
    <p>Veuillez cliquer sur le lien ici pour réinitialiser votre mot de passe : <a href="http://149.202.52.182:8080/reset-password?token=${token}">Je réinitialise mon mot de passe</a></p>
    <br>
    <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNlMmxpYW93azB4b3h1Nmd3NWo5eTZtcnF3NWc3ZHg2bzlyb3hvaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0G17mcoGBEabVgn6/giphy.gif" alt="gif">
    <br>
    <br>
    <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet email.</p>
    <p>Cordialement,</p>
    <p>L'équipe NodeChess</p>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
  });
}

//sendForgotPasswordEmail('muthulan.m@gmail.com', '1234567890')

module.exports = {
  sendVerificationEmail,
  sendForgotPasswordEmail
}
