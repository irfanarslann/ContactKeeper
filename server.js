const express = require("express");
const app = express();

const connectDB = require("./config/db");

//Connect MongoDB Database
connectDB();

//Init Middleware (Body parser)
app.use(express.json({ extended: false }));

//Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3535;
app.listen(PORT, () => {
  console.log(`Server Connected on Port : ${PORT}`);
});
