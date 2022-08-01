import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 10
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  it('should throw if bacypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  it('should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.comparer('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})
