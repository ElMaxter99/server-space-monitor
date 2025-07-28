const checkDiskSpace = require('check-disk-space').default;

async function getDiskUsage(path) {
  try {
    const { free, size } = await checkDiskSpace(path);
    const used = size - free;
    const percentUsed = ((used / size) * 100).toFixed(2);

    return {
      total: (size / 1e9).toFixed(2) + ' GB',
      used: (used / 1e9).toFixed(2) + ' GB',
      available: (free / 1e9).toFixed(2) + ' GB',
      percentUsed: parseFloat(percentUsed)
    };
  } catch (error) {
    console.error('Error al obtener uso de disco:', error);
    return null;
  }
}

module.exports = { getDiskUsage };
