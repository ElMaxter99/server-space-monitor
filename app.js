const { getDiskUsage } = require('./services/diskService');
const { sendAlert } = require('./services/emailService');
const { monitor } = require('./config');

function isWithinAllowedHours() {
  const [start, end] = monitor.hoursAllowed.split('-').map(Number);
  const currentHour = new Date().getHours();
  return currentHour >= start && currentHour < end;
}

async function checkDisk() {
  const diskInfo = await getDiskUsage(monitor.diskPath);
  if (!diskInfo) return;

  console.log(`[${new Date().toISOString()}] Uso de disco: ${diskInfo.percentUsed}%`);

  const shouldSend = monitor.sendAlways || diskInfo.percentUsed >= monitor.threshold;

  if (shouldSend && isWithinAllowedHours()) {
    await sendAlert(diskInfo);
  }
}

console.log('Monitor de disco iniciado...');
setInterval(checkDisk, monitor.intervalMinutes * 60 * 1000);
checkDisk();
