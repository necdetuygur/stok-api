const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/user");
const todoRoutes = require("./routes/todo");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/user", userRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
