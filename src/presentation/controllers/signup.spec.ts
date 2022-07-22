import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  it('should return 400 if no name is provid', () => {
    const sut = new SignUpController()
    const httpRequest = {
      bdoy: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Misssing param: name'))
  })
})
