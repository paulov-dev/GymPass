import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase  

describe('Get user Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })
    it('should be able to get user profile', async () => {          
        
        const createdUser = await usersRepository.create({
            name: 'Paulo Victor',
            email: 'paulovmmf@gmail.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('Paulo Victor')

    })

    it('should not be able to get user profile wrong id', async () => {

        expect(() => sut.execute({
            userId: 'non-existing-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})