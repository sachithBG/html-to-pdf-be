const express = require("express");
const cors = require("cors");
// const passport = require("passport");
const logger = require("morgan");
const axios = require("axios");

const PORT = 4000;
require("dotenv").config({ path: ".env" });


const app = express();
// app.set("trust proxy", true);
// require("./app/config/passport")(passport);
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(logger("dev"));
// app.use(cookieParser());
// app.use(passport.initialize());
var corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:3033",
    "http://128.140.58.93",
  ],
  optionsSuccessStatus: 200, // For legacy browser support,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
// app.use(
//   cookieSession({
//     name: "session",
//     signed: false,
//   })
// );

// app.use("/api/auth", require("./app/routes/auth.route"));
app.use("/api/htmlToPdf", require("./app/routes/htmlToPdf.route"));
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

const triggerApi = () => {
    const apiUrl = "http://localhost:4000/api/htmlToPdf"; // Adjust to your server's URL
    axios.get(apiUrl, { /* Optional payload */ })
        .then((response) => {
            console.log("API called successfully:", response.data);
        })
        .catch((error) => {
            console.error("Error calling API:", error.message);
        });
};

// triggerApi();


