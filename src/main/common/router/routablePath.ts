export class RoutablePath {
  constructor (public uri: string, public associatedView: string) {
    if (!uri || uri.trim() === '') {
      throw new Error('uri is missing')
    }

    if (!associatedView || associatedView.trim() === '') {
      throw new Error('associatedView is missing')
    }
  }
}
