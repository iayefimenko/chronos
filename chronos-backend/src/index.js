require("dotenv").config();

const app = require("./config/express");
const logger = require("./config/logger");
const { ConnectToDatabase } = require("./config/mongoose");

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  ConnectToDatabase();
  logger.info(`Server started on PORT ${PORT}`);
});
