export class SitesModel {
  id: string;
  description: string;
  //@ts-ignore
  siteUsers: Array<{email: string, forename: string, surname: string, roles: string}>;
}
