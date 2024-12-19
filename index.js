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

// Apply middleware for versioning before handling routes
app.use('/api/:version/pdf', require("./app/middleware/apiVersionMiddleware"));

// app.use("/api/auth", require("./app/routes/auth.route"));

app.use("/api/v1/users", require("./app/routes/user.route"));
app.use("/api/v1/profiles", require("./app/routes/profile.route"));
app.use("/api/v1/organizations", require("./app/routes/organization.route"));
app.use("/api/v1/addons", require("./app/routes/addonManage.route"));

app.use("/api/v1/tags", require("./app/routes/tagManage.route"));
app.use("/api/v1/dynamic-html-table", require("./app/routes/dynamicHtmlTable.route"));

app.use("/api/v1/pdf-templates", require("./app/routes/pdfManage.route"));
app.use("/api/v2/pdf", require("./app/routes/pdfManageV2.route"));

app.use('/api/v1/tokens', require("./app/routes/token.routes"));



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


