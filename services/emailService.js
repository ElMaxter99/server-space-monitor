const nodemailer = require('nodemailer');
const { smtp, app } = require('../config');

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: {
    user: smtp.user,
    pass: smtp.pass
  }
});

async function sendAlert(diskInfo) {
  const subject = `Alerta: Uso de disco ${diskInfo.percentUsed}%`;
  const text = `
    Servidor: ${ app.serverName || smtp.host}
    Total: ${diskInfo.total}
    Usado: ${diskInfo.used}
    Disponible: ${diskInfo.available}
    Porcentaje: ${diskInfo.percentUsed}%
    `;

  await transporter.sendMail({
    from: smtp.user,
    to: smtp.to,
    subject,
    text
  });

  console.log('Correo enviado con éxito.');
}

module.exports = { sendAlert };
