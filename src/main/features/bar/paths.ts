import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly loginReceiver = new RoutablePath('/bar/hello', 'n/a')
  static readonly welcomePage = new RoutablePath('/bar/hello', 'bar/views/hello')
  static readonly postRecord = new RoutablePath('/posts/record', 'posts/index')
  static readonly loginPage = new RoutablePath('/login', 'n/a')
  static readonly indexPage = new RoutablePath('/', 'n/a')
  static readonly dashboardPage = new RoutablePath('/dashboard', 'n/a')
}
