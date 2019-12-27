import { testDouble, expect } from './config/helpers'
import { describe } from 'mocha'
import User from '../../server/modules/user/service'
const model = require('../../server/models')

describe('Testes Unitários do Controller', () => {

    const defaultUser = {
        id: 1,
        name: 'Default User',
        email: 'defaultuser@email.com',
        password: '1234'
    }

    beforeEach((done) => {
        model.User.destroy({
            where: {}
        })
        .then(() => {
            model.User.create(defaultUser)
            .then(() => {
                console.log('Default user created')
                done()
            })
        })
    })

    describe('Metodo Create', ()=> {
        it('Deve criar um Usuário', () => {
            const novoUsuario = {
                id: 2,
                name: 'Novo Usuario',
                email: 'novousuario@email.com',
                password: '1234'
            }
            return User.create(novoUsuario)
                        .then(data => {
                            console.log(data)
                            expect(data.dataValues).to.have.all.keys(
                                ['email','id','name','password', 'updatedAt', 'createdAt']
                            )
                        })
                        .catch(error => console.log(error))

        })
    })

    describe('Metodo Update', () => {
        it('Deve atualizar um Usuário', () => {
            const usuarioAtualizado = {
                name: 'Nome atualizado',
                email: 'atualizado@email.com'
            }
            return User.update(defaultUser.id, usuarioAtualizado).then(data => {
                expect(data[0]).to.be.equal(1)
            })

        })
    })

    describe('Metodo GET Users', () => {
        it('Deve retornar uma lista com todos os Usuários', () => {
            return User.getAll()
            .then(data => {
                expect(data).to.be.an('array')
            })
        })
    })

    describe('Metodo GetById', () => {
        it('Retornar um usuario de acordo com o id passado', () => {
            return User.getById(defaultUser.id).then(data => {
                expect(data).to.have.all.keys([
                    'email','id','name','password'
                ])
            })
        })
    })

    describe('Metodo GetByEmail', () => {
        it('Retornar um usuario de acordo com o email passado', () => {
            return User.getByEmail(defaultUser.email).then(data => {
                expect(data).to.have.all.keys([
                    'email','id','name','password'
                ])
            })
        })
    })

    describe('Metodo Delete', () => {
        it('Deve deletar um Usuário', () => {
            return User.delete(defaultUser.id).then(data => {
                expect(data).to.be.equal(1)
            })
            
        })
    })
})