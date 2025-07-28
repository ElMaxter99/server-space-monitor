const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { smtp, app } = require("../config");

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

function renderTemplate(templatePath, data) {
  let template = fs.readFileSync(templatePath, "utf-8");
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    template = template.replace(regex, data[key]);
  });
  return template;
}

async function sendAlert(diskInfo) {
  const percent = diskInfo.percentUsed;
  const color = percent > 90 ? "#d9534f" : percent > 70 ? "#f0ad4e" : "#5cb85c";

  const html = renderTemplate(
    path.join(__dirname, "../templates/alert-email.html"),
    {
      color,
      percent,
      serverName: app.serverName || smtp.host,
      total: diskInfo.total,
      used: diskInfo.used,
      available: diskInfo.available,
    }
  );

  const subject = `Alerta: Uso de disco ${percent}%`;

  const mailOptions = {
    from: `'Server Space Monitor' <${smtp.from || smtp.user}>`,
    to: smtp.to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log(`
      [EMAIL SENT]
      Fecha: ${new Date().toISOString()}
      De: ${mailOptions.from}
      Para: ${mailOptions.to}
      Asunto: ${subject}
      Mensaje ID: ${info.messageId}
    `);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
}

module.exports = { sendAlert };
