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
    networkInterfaces[x].forEach((t) => {
      console.log(`http://${t.address}:${port}`);
    });
  });
  console.log("___");
  Object.keys(networkInterfaces).forEach((x) => {
    networkInterfaces[x].forEach((t) => {
      console.log(`https://${t.address}:${port}`);
    });
  });
  console.log("___");
});
