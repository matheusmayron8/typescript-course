"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatus = require("http-status");
function authFail(req, res) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
}
exports.default = authFail;
