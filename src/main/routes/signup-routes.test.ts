import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  it('should return account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Luiz',
        email: 'luiz@email.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
  })
})
