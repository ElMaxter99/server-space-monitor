'use strict';

module.exports = {
  app: {
    port:process.env.PORT,
    serverName: process.env.NAME_SERVER
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    to: process.env.EMAIL_TO
  },
  monitor: {
    diskPath: process.env.DISK_PATH || '/host',
    threshold: parseFloat(process.env.THRESHOLD || 80),
    intervalMinutes: parseInt(process.env.INTERVAL_MINUTES || 30),
    sendAlways: process.env.SEND_ALWAYS === 'true',
    hoursAllowed: process.env.HOURS_ALLOWED || '00-23'
  }
};
