const cron = require('node-cron');
const diskService = require('../services/diskService');
const emailService = require('../services/emailService');

function start() {
  const intervalHours = process.env.CHECK_INTERVAL_HOURS || 1;
  const cronExpr = `0 */${intervalHours} * * *`;

  console.log(`📅 Scheduler iniciado: cada ${intervalHours} horas.`);

  cron.schedule(cronExpr, async () => {
    console.log('🔍 Ejecutando chequeo de espacio...');
    const status = await diskService.getDiskUsage('/');

    const mode = process.env.CHECK_MODE || 'threshold';
    const threshold = parseFloat(process.env.THRESHOLD_PERCENT || 80);

    let sendEmail = false;

    if (mode === 'always') {
      sendEmail = true;
    } else if (mode === 'threshold' && parseFloat(status.percentUsed) >= threshold) {
      sendEmail = true;
    }

    if (sendEmail) {
      const message = `Uso actual del disco:
      Total: ${status.total}
      Usado: ${status.used}
      Disponible: ${status.available}
      Porcentaje usado: ${status.percentUsed}%`;

      await emailService.sendAlertEmail('Alerta: Espacio en disco', message);
    } else {
      console.log('✅ Todo bien, no se envía correo.');
    }
  });
}

module.exports = { start };
