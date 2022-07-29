import {
  CompareFieldsValidation
} from '../../presentation/helpers/validators/compare-fields-validation'
import {
  RequiredValidationField
} from '../../presentation/helpers/validators/required-validation-field'
import {
  ValidationComposite
} from '../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../presentation/helpers/validators/validaton'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredValidationField(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
