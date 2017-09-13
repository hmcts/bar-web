import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly loginReceiver = new RoutablePath('/bar/hello', 'n/a')
  static readonly welcomePage = new RoutablePath('/bar/hello', 'bar/views/hello')

}
