import { InvalidParamError } from '../../errors'
import { Validation } from './validaton'

export class CompareFieldsValidation implements Validation {
  private readonly fieldname: string
  private readonly fieldToCompareName: string

  constructor (fieldname: string, fieldToCompareName: string) {
    this.fieldname = fieldname
    this.fieldToCompareName = fieldToCompareName
  }

  validate (input: any): Error {
    if (input[this.fieldname] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
