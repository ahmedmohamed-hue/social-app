export const formatValidationError = (e: any) => {
  let err = {} as any

  e.graphQLErrors[0].extensions.exception.validationErrors.forEach((e: any) => {
    err[e.property] = e.constraints[Object.keys(e.constraints)[0]]
  })

  return err
}
