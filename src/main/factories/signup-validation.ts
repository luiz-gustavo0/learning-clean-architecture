
import {
  RequiredValidationField
} from '../../presentation/helpers/validators/required-validation-field'
import {
  ValidationComposite
} from '../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../presentation/helpers/validators/validaton'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredValidationField(field))
  }
  return new ValidationComposite(validations)
}
