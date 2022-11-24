const eightPmCronJob = require("./eightPMCronJob");
const fiveAmCronJob = require("./fiveAmCronJob");
const tenAmCronJob = require("./tenAmCronJob");
const threePmCronJob = require("./threePMCronJob");

const cronJobs = {
  fiveAmCronJob: fiveAmCronJob,
  tenAmCronJob: tenAmCronJob,
  threePmCronJob: threePmCronJob,
  eightPmCronJob: eightPmCronJob,
};

module.exports = cronJobs;
