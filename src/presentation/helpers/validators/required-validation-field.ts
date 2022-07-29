import { MissingParamError } from '../../errors'
import { Validation } from './validaton'

export class RequiredValidationField implements Validation {
  private readonly fieldname: string

  constructor (fieldname: string) {
    this.fieldname = fieldname
  }

  validate (input: any): Error {
    if (!input[this.fieldname]) {
      return new MissingParamError(this.fieldname)
    }
  }
}
