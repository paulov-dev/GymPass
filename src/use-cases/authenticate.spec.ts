import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
    it('should be able to authenticate', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(usersRepository)    
        
        await usersRepository.create({
            name: 'Paulo Victor',
            email: 'paulovmmf@gmail.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await authenticateUseCase.execute({
            email: 'paulovmmf@gmail.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))

    })

    it('should not be able to authenticate with wrong email', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(usersRepository)    

        expect(() => authenticateUseCase.execute({
            email: 'paulovmmf@gmail.com',
            password: '123465'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(usersRepository)    

        expect(() => authenticateUseCase.execute({
            email: 'paulovmmf@gmail.com',
            password: '123123'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})