provider "azurerm" {
  version = "1.19.0"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  local_ase = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "core-compute-aat" : "core-compute-saat" : local.aseName}"

  previewVaultName = "bar-aat"
  nonPreviewVaultName = "${var.product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"
  rgName= "bar-${var.env}-rg"
  vault_rg_name = "${(var.env == "preview" || var.env == "spreview") ? "bar-aat-rg" : local.rgName}"

}

data "azurerm_key_vault" "bar_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${local.vault_rg_name}"
}

data "azurerm_key_vault_secret" "idam_client_secret" {
  name = "bar-IDAM-CLIENT-SECRET"
  vault_uri = "${data.azurerm_key_vault.bar_key_vault.vault_uri}"
}

module "bar-web" {
  source   = "git@github.com:hmcts/cnp-module-webapp?ref=master"
  product  = "${var.product}-web"
  location = "${var.location}"
  env      = "${var.env}"
  ilbIp    = "${var.ilbIp}"
  subscription = "${var.subscription}"
  is_frontend  = "${var.is_frontend}"
  capacity = "${var.capacity}"
  additional_host_name = "${var.product_url}"
  https_only = "true"
  common_tags     = "${var.common_tags}"
  asp_name = "${var.asp_name}-${var.env}"
  asp_rg = "${local.rgName}"
  app_settings = {
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication_web_url}"
    IDAM_LOGIN_URL = "${var.authentication_web_url}/o/authorize"
    IDAM_CLIENT_SECRET = "${data.azurerm_key_vault_secret.idam_client_secret.value}"
    BAR_API_URL = "http://bar-api-${local.local_env}.service.${local.local_ase}.internal"

    FEE_API_URL = "http://fees-register-api-${local.local_env}.service.${local.local_ase}.internal/fees-register"
    # URL for getting jurisdictions
    FEE_API_JURISDICTIONS_URL = "http://fees-register-api-${local.local_env}.service.${local.local_ase}.internal"
    DUMMY_PROPERTY = "dummy"

    NODE_ENV = "production"
    # temporary variable to ignore certs loading in start.js as it's handled at IIS server level
    IGNORE_CERTS = "true"
    SKIP_FUNCTIONAL_TEST = "${var.skip_functional_tests}"
  }
}
