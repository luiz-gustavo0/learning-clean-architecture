import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: any
}

const makeSut = (): SutTypes => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
      return await new Promise(resolve => resolve(account))
    }
  }
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return { sut, loadAccountByEmailRepositoryStub }
}

describe('DbAuthentication', () => {
  it('should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@email.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
