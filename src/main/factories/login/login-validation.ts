import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import {
  RequiredValidationField
} from '../../../presentation/helpers/validators/required-validation-field'
import {
  ValidationComposite
} from '../../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../../presentation/helpers/validators/validaton'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredValidationField(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
