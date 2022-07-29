import { MissingParamError } from '../../errors'
import { RequiredValidationField } from './required-validation-field'

describe('RequiredFiled Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredValidationField('field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
