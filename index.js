const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser')
const logger = require("morgan");

const PORT = 4000;
require("dotenv").config({ path: ".env" });
const app = express();
var corsOptions = {
  origin: '*',//["http://localhost:3000", "https://html-to-pdf-fe-b4lt-podsdqd9q-sachiths-projects-785dc9ca.vercel.app"],
  optionsSuccessStatus: 200, // For legacy browser support,
  credentials: true,
};

app.use(logger("dev"));
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// Apply middleware for versioning before handling routes
app.use('/api/:version/pdf', require("./app/middleware/apiVersionMiddleware"));

app.use("/api/v1/users", require("./app/routes/user.route"));
app.use("/api/v1/profiles", require("./app/routes/profile.route"));
app.use("/api/v1/organizations", require("./app/routes/organization.route"));
app.use("/api/v1/addons", require("./app/routes/addonManage.route"));
app.use("/api/v1/external-keys", require("./app/routes/externalKey.route"));

app.use("/api/v1/tags", require("./app/routes/tagManage.route"));
app.use("/api/v1/dynamic-html-table", require("./app/routes/dynamicHtmlTable.route"));

app.use("/api/v1/pdf-templates", require("./app/routes/pdfManage.route"));
app.use("/api/v2/pdf", require("./app/routes/pdfGenerate.route"));
app.use("/api/v1/logs", require("./app/routes/requestManager.route"));

app.use('/api/v1/tokens', require("./app/routes/token.routes"));
app.use('/api/v1/media', require("./app/routes/mediaLocale.route"));
app.use("/api/v1/s3", require("./app/routes/s3.route"));



app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
