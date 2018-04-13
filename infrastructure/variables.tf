variable "product" {
  type = "string"
  default = "bar"
}

variable "location" {
  type    = "string"
  default = "UK South"
}

variable "env" {}

variable "subscription" {}

variable "ilbIp"{}

variable "tenant_id" {}

variable "jenkins_AAD_objectId" {
  type                        = "string"
  description                 = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "node_environment" {
  default = "sandbox"
}

variable "idam_api_url" {
  default = "http://betaDevBccidamAppLB.reform.hmcts.net"
}

variable "authentication_web_url" {
  default = "https://idam-test.dev.ccidam.reform.hmcts.net"
}

variable "vault_section" {
  default = "test"
}

variable "external_host_name" {
  default = "bar-web.nonprod.platform.hmcts.net"
}

