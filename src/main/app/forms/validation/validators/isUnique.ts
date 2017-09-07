import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export function IsUnique (uniquenessCheck: (value: any) => Promise<boolean>, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate (value: any, args: ValidationArguments) {
          return uniquenessCheck(value)
        }
      }
    })
  }
}
