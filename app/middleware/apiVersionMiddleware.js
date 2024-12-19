// apiVersionMiddleware.js
const express = require("express");

module.exports = function apiVersioningMiddleware(req, res, next) {
    const version = req.params.version;

    // Check if the version is provided and is valid
    const validVersions = ["v1", "v2"];  // Add any new versions here
    if (!validVersions.includes(version)) {
        return res.status(400).json({
            message: `Invalid API version. Supported versions: ${validVersions.join(", ")}`,
        });
    }

    // If version is valid, proceed to the next middleware or route handler
    next();
};
