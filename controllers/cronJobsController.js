const cronHookBaseApi = "https://api.cronhooks.io";

exports.createCronJob = async (req, res) => {
  const url = `${cronHookBaseApi}/schedules`;

  const raw = JSON.stringify({
    title: "test-cron-job",
    description: "Send email as a test",
    url: "https://224b-197-210-54-189.eu.ngrok.io/crons/",
    timezone: "Africa/Lagos",
    method: "POST",
    contentType: "application/json; charset=utf-8",
    isRecurring: false,
    runAt: new Date().toISOString(),
    sendCronhookObject: true,
    sendFailureAlert: true,
    headers: {},
  });

  try {
    const result = await fetch(url, { method: "POST", body: raw });
    const data = await result.text();
    res.send({ data });
  } catch (error) {
    res.send({ error });
  }
};

exports.cronWeatherNotify = (req, res) => {};
