const cron = require("node-cron");
const { archiveOldMessages } = require("../controllers/archiveController");

// Schedule cron job to run every night at 2 AM
cron.schedule("0 2 * * *", async () => {
  console.log(`[${new Date().toISOString()}] Running daily chat archive job...`);
  await archiveOldMessages();
});
