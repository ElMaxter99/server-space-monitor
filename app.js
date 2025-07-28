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

  const now = new Date().toISOString();

  console.log(`
[${now}] Disk Usage Report:
-----------------------------------
Total:       ${diskInfo.total}
Used:        ${diskInfo.used}
Available:   ${diskInfo.available}
Usage:       ${diskInfo.percentUsed}%
-----------------------------------
`);

  const shouldSend = monitor.sendAlways || diskInfo.percentUsed >= monitor.threshold;

  if (shouldSend && isWithinAllowedHours()) {
    await sendAlert(diskInfo);
  }
}

console.log('✅ Disk monitor started...');
checkDisk();
setInterval(checkDisk, monitor.intervalMinutes * 60 * 1000);
