import { AuthenticationModel } from '../../../domain/usecases/autentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { Encrypter } from '../../protocols/criptography/encrypter'
import {
  LoadAccountByEmailRepository
} from '../../protocols/db/load-account-by-email-repository'
import { UpadateAccesTokenRepository } from '../../protocols/db/update-accessToken-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccout = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'hashed_password'
  }
}

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@email.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccout()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async comparer (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new EncrypterStub()
}

const makeupadateAccesTokenRepository = (): UpadateAccesTokenRepository => {
  class UpadateAccesTokenRepositorySutb implements UpadateAccesTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpadateAccesTokenRepositorySutb()
}
interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerSutb: HashComparer
  encrypterSutb: Encrypter
  upadateAccesTokenRepositorySutb: UpadateAccesTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerSutb = makeHashComparer()
  const encrypterSutb = makeEncrypter()
  const upadateAccesTokenRepositorySutb = makeupadateAccesTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerSutb,
    encrypterSutb,
    upadateAccesTokenRepositorySutb
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerSutb,
    encrypterSutb,
    upadateAccesTokenRepositorySutb
  }
}

describe('DbAuthentication', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  it('should throw LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('should retrun null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  it('should call hashCompare with correct values', async () => {
    const { sut, hashComparerSutb } = makeSut()
    const comapreSpy = jest.spyOn(hashComparerSutb, 'comparer')
    await sut.auth(makeFakeAuthentication())
    expect(comapreSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('should throw hashCompare throws', async () => {
    const { sut, hashComparerSutb } = makeSut()
    jest.spyOn(hashComparerSutb, 'comparer').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('should retrun null if hashCompare returns false', async () => {
    const { sut, hashComparerSutb } = makeSut()
    jest.spyOn(hashComparerSutb, 'comparer').mockReturnValueOnce(
      new Promise((resolve) => resolve(false))
    )
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterSutb } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterSutb, 'encrypt')
    await sut.auth(makeFakeAuthentication())
    expect(encrypterSpy).toHaveBeenCalledWith('any_id')
  })

  it('should throw Encrypter throws', async () => {
    const { sut, encrypterSutb } = makeSut()
    jest.spyOn(encrypterSutb, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('should return a token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  it('should call UpadateAccesTokenRepository with correct values', async () => {
    const { sut, upadateAccesTokenRepositorySutb } = makeSut()
    const updateSpy = jest.spyOn(upadateAccesTokenRepositorySutb, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  it('should throw UpadateAccesTokenRepository throws', async () => {
    const { sut, upadateAccesTokenRepositorySutb } = makeSut()
    jest.spyOn(upadateAccesTokenRepositorySutb, 'update').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
