import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/autentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { Encrypter } from '../../protocols/criptography/encrypter'
import {
  LoadAccountByEmailRepository
} from '../../protocols/db/load-account-by-email-repository'
import { UpadateAccesTokenRepository } from '../../protocols/db/update-accessToken-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly upadateAccesTokenRepository: UpadateAccesTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    upadateAccesTokenRepository: UpadateAccesTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.upadateAccesTokenRepository = upadateAccesTokenRepository
  }

  async auth ({ email, password }: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email)
    if (account) {
      const isValid = await this.hashComparer.comparer(password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.upadateAccesTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
