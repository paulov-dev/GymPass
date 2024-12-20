import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
    it('should be able to register', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)        

        const { user } = await registerUseCase.execute({
            name: 'Paulo Victor',
            email: 'paulo@example.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        )

        expect(user.id).toEqual(expect.any(String))

    })

    it('should not be able to register with same email twice', async () => {

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)        

        const email = 'paulo@example.com'

        await registerUseCase.execute({
            name: 'Paulo Victor',
            email: email,
            password: '123456'
        })

        await expect(() => 
            registerUseCase.execute({
                name: 'Paulo Victor',
                email: email,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})