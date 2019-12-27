"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jwt-simple");
var HTTPStatus = require("http-status");
var helpers_1 = require("./config/helpers");
var mocha_1 = require("mocha");
mocha_1.describe('Testes de Integração', function () {
    'use strict';
    var config = require('../../server/config/env/config')();
    var model = require('../../server/models');
    var id = 100;
    var token;
    var userTest = {
        id: 100,
        name: 'Usuário Teste',
        email: 'teste@email.com',
        password: 'teste'
    };
    var userDefault = {
        id: 1,
        name: 'Default User',
        email: 'default@email.com',
        password: 'default'
    };
    var userNew = {
        id: 3,
        name: 'Integration',
        email: 'integration@email.com',
        password: 'integration'
    };
    //Executada antes de cada teste ser executado
    beforeEach(function (done) {
        //Limpa base
        model.User.destroy({
            where: {}
        }).then(function () {
            return model.User.create(userDefault);
        }).then(function (user) {
            model.User.create(userTest)
                .then(function () {
                token = jwt.encode({ id: user.id }, config.secret);
                done();
            });
        });
    });
    mocha_1.describe('POST /token', function () {
        it('Deve retornar um JWT', function (done) {
            var credentials = {
                email: userDefault.email,
                password: userDefault.password
            };
            helpers_1.request(helpers_1.app)
                .post('/token')
                .send(credentials)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.token).to.equal("" + token);
                done(error);
            });
        });
        it('Não deve gerar um JWT', function (done) {
            var credentials = {
                email: 'email@emailqualquer.com',
                password: 'qualquer'
            };
            helpers_1.request(helpers_1.app)
                .post('/token')
                .send(credentials)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.UNAUTHORIZED);
                helpers_1.expect(res.body).to.empty;
                done(error);
            });
        });
    });
    mocha_1.describe('GET /api/users/all', function () {
        it('Deve retornar um Array com todos os Usuários', function (done) {
            helpers_1.request(helpers_1.app)
                .get('/api/users/all')
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.payload).to.be.an('array');
                helpers_1.expect(res.body.payload[0].name).to.be.equal(userDefault.name);
                helpers_1.expect(res.body.payload[0].email).to.be.equal(userDefault.email);
                console.log(res.body.payload);
                done(error);
            });
        });
    });
    mocha_1.describe('GET /api/users/:id', function () {
        it('Deve retornar um array apenas um usuário', function (done) {
            helpers_1.request(helpers_1.app)
                .get("/api/users/" + userDefault.id)
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.payload.id).to.equal(userDefault.id);
                helpers_1.expect(res.body.payload).to.have.all.keys(['id', 'name', 'email', 'password']);
                done(error);
            });
        });
    });
    mocha_1.describe('POST /api/users/create', function () {
        it('Deve criar um Usuário', function (done) {
            helpers_1.request(helpers_1.app)
                .post('/api/users/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .send(userNew)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.payload.id).to.eql(userNew.id);
                helpers_1.expect(res.body.payload.name).to.eql(userNew.name);
                helpers_1.expect(res.body.payload.email).to.eql(userNew.email);
                done(error);
            });
        });
    });
    mocha_1.describe('PUT /api/users/:id/update', function () {
        it('Deve atualizar um usuário', function (done) {
            var user = {
                name: 'TestUpdate',
                email: 'update@email.com',
                password: 'updated'
            };
            helpers_1.request(helpers_1.app)
                .put("/api/users/" + userTest.id + "/update")
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .send(user)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.payload).to.be.an('array');
                done(error);
            });
        });
    });
    mocha_1.describe('DELETE /api/users/:id/destroy', function () {
        it('Deve deletar um Usuário', function (done) {
            id = userTest.id;
            helpers_1.request(helpers_1.app)
                .delete("/api/users/" + userTest.id + "/destroy")
                .set('Content-Type', 'application/json')
                .set('Authorization', "Bearer " + token)
                .end(function (error, res) {
                helpers_1.expect(res.status).to.equal(HTTPStatus.OK);
                helpers_1.expect(res.body.payload).to.be.equal(1);
                done(error);
            });
        });
    });
});
