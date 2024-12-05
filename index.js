const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require('express-session')
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(session({
  secret: 'secret_password',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000 * 30,
    secure: false
  }
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

const mainRoutes = require("./routes/main");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const booksRoutes = require("./routes/books");
const authorRoutes = require("./routes/admin_panel/author");
const bookRoutes = require("./routes/admin_panel/book");
const userPanelRoutes = require("./routes/admin_panel/admin_panel");
const adminCategory = require('./routes/admin_panel/category')
const adminAddBook = require('./routes/admin_panel/add_book')
const adminAddAuthor = require('./routes/admin_panel/add_author')
const adminAddUser = require('./routes/admin_panel/add_user')
const adminUsers = require('./routes/admin_panel/users')
const wypozyczeniaRoutes = require('./routes/wypozyczenia')
const logoutRoutes = require('./routes/admin_panel/logout')
const resetDatabaseRoutes = require('./routes/reset_database')

app.use("/", mainRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/books", booksRoutes);
app.use("/admin/author", authorRoutes);
app.use("/admin/book", bookRoutes);
app.use("/admin/admin_panel", userPanelRoutes);
app.use("/admin/category", adminCategory);
app.use("/admin/add-book", adminAddBook);
app.use("/admin/add-author", adminAddAuthor);
app.use("/admin/add-user", adminAddUser);
app.use('/admin/users', adminUsers)
app.use('/wypozyczenia', wypozyczeniaRoutes)
app.use('/logout', logoutRoutes)
app.use('/resetDataBase', resetDatabaseRoutes)

app.listen(port, () => {
  console.log(`Serwer działa na porice ${port}`);
});
