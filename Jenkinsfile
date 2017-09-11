#!groovy
@Library('Reform')
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Packager
import uk.gov.hmcts.RPMTagger

properties(
  [[$class: 'GithubProjectProperty', projectUrlStr: 'http://git.reform.hmcts.net/bar/bar-admin-web'],
   pipelineTriggers([[$class: 'GitHubPushTrigger']])]
)

Ansible ansible = new Ansible(this, 'ccfr_admin')
Packager packager = new Packager(this, 'cc')

timestamps {
  milestone()
  lock(resource: "bar-admin-web-${env.BRANCH_NAME}", inversePrecedence: true) {
    node('slave') {
      try {
        stage('Checkout') {
          deleteDir()
          checkout scm
        }

        stage('Setup') {
          sh '''
            yarn install
            yarn setup
          '''
        }

        stage('Lint') {
          sh "yarn run lint"
        }

        stage('Node security check') {
          try {
            sh "yarn test:nsp 2> nsp-report.txt"
          } catch (ignore) {
            sh "cat nsp-report.txt"
            archiveArtifacts 'nsp-report.txt'
            error "Node security check failed see the report for the errors"
          }
          sh "rm nsp-report.txt"
        }

        stage('Test') {
          try {
            sh "yarn test"
          } finally {
            archiveArtifacts 'mochawesome-report/unit.html'
          }
        }

        stage('Test routes') {
          try {
            sh "yarn test:routes"
          } finally {
            archiveArtifacts 'mochawesome-report/routes.html'
          }
        }

        stage('Test a11y') {
          try {
            sh "yarn test:a11y"
          } finally {
            archiveArtifacts 'mochawesome-report/a11y.html'
          }
        }

        def barWebDockerVersion

        stage('Build Docker') {
          barWebDockerVersion = dockerImage imageName: 'bar/bar-admin-web'
        }

        stage("Trigger acceptance tests") {
          build job: '/bar/bar-admin-web-acceptance-tests/master', parameters: [
            [$class: 'StringParameterValue', name: 'barWebDockerVersion', value: barWebDockerVersion]
          ]
        }

        onMaster {
          def rpmVersion

          stage('Publish RPM') {
            rpmVersion = packager.nodeRPM('bar-admin-web')
            packager.publishNodeRPM('bar-admin-web')
          }

          stage('Deploy (Dev)') {
            ansible.runDeployPlaybook("{bar_admin_version: ${rpmVersion}}", 'dev')
            RPMTagger rpmTagger = new RPMTagger(this, 'bar-admin-web', packager.rpmName('bar-admin-web', rpmVersion), 'cc-local')
            rpmTagger.tagDeploymentSuccessfulOn('dev')
          }
        }
      } catch (Throwable err) {
        notifyBuildFailure channel: '#cc-payments-tech'
        throw err
      }
    }
    milestone()
  }
}
