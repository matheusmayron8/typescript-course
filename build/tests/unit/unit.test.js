"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./config/helpers");
var mocha_1 = require("mocha");
var service_1 = require("../../server/modules/user/service");
var model = require('../../server/models');
mocha_1.describe('Testes Unitários do Controller', function () {
    var defaultUser = {
        id: 1,
        name: 'Default User',
        email: 'defaultuser@email.com',
        password: '1234'
    };
    beforeEach(function (done) {
        model.User.destroy({
            where: {}
        })
            .then(function () {
            model.User.create(defaultUser)
                .then(function () {
                console.log('Default user created');
                done();
            });
        });
    });
    mocha_1.describe('Metodo Create', function () {
        it('Deve criar um Usuário', function () {
            var novoUsuario = {
                id: 2,
                name: 'Novo Usuario',
                email: 'novousuario@email.com',
                password: '1234'
            };
            return service_1.default.create(novoUsuario)
                .then(function (data) {
                console.log(data);
                helpers_1.expect(data.dataValues).to.have.all.keys(['email', 'id', 'name', 'password', 'updatedAt', 'createdAt']);
            })
                .catch(function (error) { return console.log(error); });
        });
    });
    mocha_1.describe('Metodo Update', function () {
        it('Deve atualizar um Usuário', function () {
            var usuarioAtualizado = {
                name: 'Nome atualizado',
                email: 'atualizado@email.com'
            };
            return service_1.default.update(defaultUser.id, usuarioAtualizado).then(function (data) {
                helpers_1.expect(data[0]).to.be.equal(1);
            });
        });
    });
    mocha_1.describe('Metodo GET Users', function () {
        it('Deve retornar uma lista com todos os Usuários', function () {
            return service_1.default.getAll()
                .then(function (data) {
                helpers_1.expect(data).to.be.an('array');
            });
        });
    });
    mocha_1.describe('Metodo GetById', function () {
        it('Retornar um usuario de acordo com o id passado', function () {
            return service_1.default.getById(defaultUser.id).then(function (data) {
                helpers_1.expect(data).to.have.all.keys([
                    'email', 'id', 'name', 'password'
                ]);
            });
        });
    });
    mocha_1.describe('Metodo GetByEmail', function () {
        it('Retornar um usuario de acordo com o email passado', function () {
            return service_1.default.getByEmail(defaultUser.email).then(function (data) {
                helpers_1.expect(data).to.have.all.keys([
                    'email', 'id', 'name', 'password'
                ]);
            });
        });
    });
    mocha_1.describe('Metodo Delete', function () {
        it('Deve deletar um Usuário', function () {
            return service_1.default.delete(defaultUser.id).then(function (data) {
                helpers_1.expect(data).to.be.equal(1);
            });
        });
    });
});
