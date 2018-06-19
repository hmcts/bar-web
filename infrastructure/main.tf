provider "vault" {
  // # tactical vault - for example: use `data "vault_generic_secret" "s2s_secret" {`
  address = "https://vault.reform.hmcts.net:6200"
}

data "vault_generic_secret" "client_secret" {
  path = "secret/${var.vault_section}/ccidam/service-auth-provider/api/microservice-keys/bar"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  local_ase = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "core-compute-aat" : "core-compute-saat" : local.aseName}"

  previewVaultName = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"
}

data "azurerm_key_vault" "bar_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}

data "azurerm_key_vault_secret" "idam_client_secret" {
  name = "bar-IDAM-CLIENT-SECRET"
  vault_uri = "${data.azurerm_key_vault.bar_key_vault.vault_uri}"
}

module "bar-web" {
  source   = "git@github.com:hmcts/moj-module-webapp?ref=master"
  product  = "${var.product}-web"
  location = "${var.location}"
  env      = "${var.env}"
  ilbIp    = "${var.ilbIp}"
  subscription = "${var.subscription}"
  is_frontend  = true
  capacity = "${var.capacity}"
  additional_host_name = "${var.product_url}"
  https_only = "true"

  app_settings = {
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication_web_url}"
    IDAM_CLIENT_SECRET = "${data.azurerm_key_vault_secret.idam_client_secret.value}"
    BAR_API_URL = "http://bar-api-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"

    FEE_API_URL = "http://fees-register-api-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal/fees-register"

    NODE_ENV = "production"
    # temporary variable to ignore certs loading in start.js as it's handled at IIS server level
    IGNORE_CERTS = "true"
  }
}

resource "azurerm_resource_group" "rg" {
  name     = "${var.raw_product}-${var.env}"
  location = "${var.location}"
}

module "bar-vault" {
  source              = "git@github.com:hmcts/moj-module-key-vault?ref=master"
  product             = "${var.product}-web"
  env                 = "${var.env}"
  tenant_id           = "${var.tenant_id}"
  object_id           = "${var.jenkins_AAD_objectId}"
  resource_group_name = "${module.bar-web.resource_group_name}"
  # group id of dcd_reform_dev_azure
  product_group_object_id = "56679aaa-b343-472a-bb46-58bbbfde9c3d"
}
