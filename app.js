require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const swaggerDocument = yaml.load("./swagger.yaml");

const connect = require("./db/connect");
const notFoundMidlleware = require("./middleware/not-found");
const errorHandlerMidlleware = require("./middleware/error-handler");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRouter");
const orderRouter = require("./routes/orderRouter");
const { authenticateUser } = require("./middleware/authentication");
const deleteEveryThing = require("./delete");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());
app.use(express.static("./public"));

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("<h1>E-commerce Api</h1>");
});

app.get("/", (req, res) => {
  res.status(200).send("<h1>E-commerce Api</h1>");
});

app.delete("/api/v1/delete", deleteEveryThing);

app.use('/swagger.yaml', express.static(path.join(__dirname, 'swagger.yaml')));
app.use("/index.html", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/products", authenticateUser, productRouter);
app.use("/api/v1/reviews", authenticateUser, reviewRouter);
app.use("/api/v1/orders", authenticateUser, orderRouter);
app.use(notFoundMidlleware);
app.use(errorHandlerMidlleware);

const start = async () => {
  try {
    connect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
