import * as jwt from 'jwt-simple'
import * as HTTPStatus from 'http-status'
import { app, request, expect } from './config/helpers'
import { describe } from 'mocha'

describe('Testes de Integração', () => {

    'use strict'

    const config = require('../../server/config/env/config')()
    const model = require('../../server/models')

    let id = 100
    let token

    const userTest = {
        id: 100,
        name: 'Usuário Teste',
        email: 'teste@email.com',
        password: 'teste'
    }

    const userDefault = {
        id: 1,
        name: 'Default User',
        email: 'default@email.com',
        password: 'default'
    }

    const userNew = {
        id: 3,
        name: 'Integration',
        email: 'integration@email.com',
        password: 'integration'
    }

    //Executada antes de cada teste ser executado
    beforeEach((done) => {
        //Limpa base
        model.User.destroy({
            where: {}
        }).then(() => {
            return model.User.create(userDefault)
        }).then(user => {
            model.User.create(userTest)
                .then(() => {
                    token = jwt.encode({id: user.id}, config.secret)
                    done()
                })
        })
    })

    describe('POST /token', () => {
        it('Deve retornar um JWT', done => {
            const credentials = {
                email: userDefault.email,
                password: userDefault.password
            }
            request(app)
                .post('/token')
                .send(credentials)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK)
                    expect(res.body.token).to.equal(`${token}`)
                    done(error)
                })
        })

        it('Não deve gerar um JWT', done => {
            const credentials = {
                email: 'email@emailqualquer.com',
                password: 'qualquer'
            }
            request(app)
                .post('/token')
                .send(credentials)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.UNAUTHORIZED)
                    expect(res.body).to.empty
                    done(error)
                })
        })
    })

    describe('GET /api/users/all', () => {
        it('Deve retornar um Array com todos os Usuários', done => {
            request(app)
                .get('/api/users/all')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK)
                    expect(res.body.payload).to.be.an('array')
                    expect(res.body.payload[0].name).to.be.equal(userDefault.name)
                    expect(res.body.payload[0].email).to.be.equal(userDefault.email)
                    console.log(res.body.payload)
                    done(error)
                })

        })
    })

    describe('GET /api/users/:id', () => {
        it('Deve retornar um array apenas um usuário', done => {
            request(app)
                .get(`/api/users/${userDefault.id}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK)
                    expect(res.body.payload.id).to.equal(userDefault.id)
                    expect(res.body.payload).to.have.all.keys(['id', 'name', 'email', 'password'])
                    done(error)
                })
        })
    })

    describe('POST /api/users/create', () => {
        it('Deve criar um Usuário', done => {
                request(app)
                .post('/api/users/create')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(userNew)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK)
                    expect(res.body.payload.id).to.eql(userNew.id)
                    expect(res.body.payload.name).to.eql(userNew.name)
                    expect(res.body.payload.email).to.eql(userNew.email)
                    done(error)
                })
        })
    })

    describe('PUT /api/users/:id/update', () => {
        it('Deve atualizar um usuário', done => {
            const user = {
                name: 'TestUpdate',
                email: 'update@email.com',
                password: 'updated'
            }
            request(app)
                .put(`/api/users/${userTest.id}/update`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(user)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK)
                    expect(res.body.payload).to.be.an('array')
                    done(error)
                })
        })
    })

    describe('DELETE /api/users/:id/destroy', () => {
        it('Deve deletar um Usuário', done => {
            id = userTest.id
            request(app)
                .delete(`/api/users/${userTest.id}/destroy`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .end((error, res) => {
                    expect(res.status).to.equal(HTTPStatus.OK)
                    expect(res.body.payload).to.be.equal(1)
                    done(error)
                })
        })
    })


})