const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const KullaniciRoutes = require("./routes/Kullanici");
const StokRoutes = require("./routes/Stok");
const StokLogRoutes = require("./routes/StokLog");
const os = require("os");
const networkInterfaces = os.networkInterfaces();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(function (req, res, next) {
  res.removeHeader("X-Powered-By");
  next();
});

app.use("/kullanici", KullaniciRoutes);
app.use("/stok", StokRoutes);
app.use("/stok-log", StokLogRoutes);

app.listen(port, () => {
  console.log("___");
  Object.keys(networkInterfaces).forEach((x) => {
    console.log(`http://${networkInterfaces[x][1].address}:${port}`);
  });
  console.log("___");
  Object.keys(networkInterfaces).forEach((x) => {
    console.log(`https://${networkInterfaces[x][1].address}:${port}`);
  });
  console.log("___");
});
