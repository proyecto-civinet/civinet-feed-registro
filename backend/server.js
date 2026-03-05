require("dotenv").config();
const emailService = require("./src/services/emailService");
const app = require("./src/app");

app.listen(4000, () => {
  console.log("Servidor corriendo en puerto 4000");
});
