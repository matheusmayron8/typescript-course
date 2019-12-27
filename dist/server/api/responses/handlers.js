"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatus = require("http-status");
var jwt = require("jwt-simple");
var bcrypt = require("bcrypt-nodejs");
var config = require('../../config/env/config')();
var Handlers = /** @class */ (function () {
    function Handlers() {
    }
    Handlers.prototype.authFail = function (req, res) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
    };
    Handlers.prototype.authSuccess = function (res, crendentials, data) {
        var isMatch = bcrypt.compareSync(crendentials.password, data.password);
        if (isMatch) {
            var payload = { id: data.id };
            res.json({
                token: jwt.encode(payload, config.secret)
            });
        }
        else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    };
    Handlers.prototype.onError = function (res, message, err) {
        console.log("Error: " + err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
    };
    Handlers.prototype.onSuccess = function (res, data) {
        res.status(HttpStatus.OK).json({ payload: data });
    };
    Handlers.prototype.errorHandlerApi = function (err, req, res, next) {
        console.error('API error handler foi executado: ${err}');
        res.status(500).json({
            errorCode: 'Error: 001',
            message: 'Erro Interno do Servidor'
        });
    };
    Handlers.prototype.dbErrorHandler = function (res, err) {
        console.log("Um erro aconteceu: " + err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: 'ERR-01',
            message: 'Erro ao criar usuário'
        });
    };
    return Handlers;
}());
exports.default = new Handlers();
