export class SitesModel {
  id: string;
  description: string;
  siteUsers: Array<{email: string, forename: string, surname: string, roles: string}>;
}
