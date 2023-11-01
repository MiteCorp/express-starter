import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import errorHandler from "./app/middleware/errorHandler";
import routes from "./routes/api.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/public", express.static(path.join(__dirname, `../public`)));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
