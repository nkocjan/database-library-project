const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

const mainRoutes = require("./routes/main");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const reservationRoutes = require("./routes/reservation");
const authorRoutes = require("./routes/admin_panel/author");
const bookRoutes = require("./routes/admin_panel/book");
const rezerwacjeRoutes = require("./routes/admin_panel/reservation_list");
const userPanelRoutes = require("./routes/admin_panel/admin_panel");
const wydawnictwoRoutes = require("./routes/admin_panel/publishing");

app.use("/", mainRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/reservation", reservationRoutes);
app.use("/admin/author", authorRoutes);
app.use("/admin/book", bookRoutes);
app.use("/admin/rezerwacje", rezerwacjeRoutes);
app.use("/admin/user_panel", userPanelRoutes);
app.use("/admin/wydawnictwo", wydawnictwoRoutes);

app.listen(port, () => {
  console.log(`Serwer działa na porice ${port}`);
});
