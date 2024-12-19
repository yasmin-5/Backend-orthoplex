const express = require("express");
const app = express();
const cors=require("cors");
app.use(cors());
const port = process.env.PORT || 3000;
const userRouter = require("./src/modules/users/users.router");
const authRouter = require("./src/modules/Authentication/auth.router");
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
