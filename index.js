const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const KullaniciRoutes = require("./routes/Kullanici");
const stokRoutes = require("./routes/Stok");

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
app.use("/stok", stokRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
