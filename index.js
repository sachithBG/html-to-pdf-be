const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser')
const logger = require("morgan");

const PORT = 4000;
require("dotenv").config({ path: ".env" });

const allowedOrigin = 'https://html-to-pdf-fe-3i37.vercel.app';//process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

const app = express();
// var corsOptions = {
//   origin: ['https://html-to-pdf-fe-3i37.vercel.app', 'http://localhost:3000'],
//   optionsSuccessStatus: 200,
//   credentials: true,
// };

const corsOptions = {
  origin: (origin, callback) => {
    if (origin === allowedOrigin || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: false, // Allow credentials like cookies
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// API Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Apply middleware for versioning before handling routes
app.use('/api_/:version/pdf', require("./app/middleware/apiVersionMiddleware"));

app.use("/api_/v1/users", require("./app/routes/user.route"));
app.use("/api_/v1/profiles", require("./app/routes/profile.route"));
app.use("/api_/v1/organizations", require("./app/routes/organization.route"));
app.use("/api_/v1/addons", require("./app/routes/addonManage.route"));
app.use("/api_/v1/external-keys", require("./app/routes/externalKey.route"));

app.use("/api_/v1/tags", require("./app/routes/tagManage.route"));
app.use("/api_/v1/dynamic-html-table", require("./app/routes/dynamicHtmlTable.route"));

app.use("/api_/v1/pdf-templates", require("./app/routes/pdfManage.route"));
app.use("/api_/v2/pdf", require("./app/routes/pdfGenerate.route"));
app.use("/api_/v1/logs", require("./app/routes/requestManager.route"));

app.use('/api_/v1/tokens', require("./app/routes/token.routes"));
app.use('/api_/v1/media', require("./app/routes/mediaLocale.route"));
app.use("/api_/v1/s3", require("./app/routes/s3.route"));



app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
