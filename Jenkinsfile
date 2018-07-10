#!groovy
@Library('Reform')
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Packager
import uk.gov.hmcts.RPMTagger

properties(
  [[$class: 'GithubProjectProperty', projectUrlStr: 'https://git.reform.hmcts.net/bar/bar-web'],
   pipelineTriggers([[$class: 'GitHubPushTrigger']])]
)

Ansible ansible = new Ansible(this, 'bar_web')
Packager packager = new Packager(this, 'bar')

timestamps {
  milestone()
  lock(resource: "bar-web-${env.BRANCH_NAME}", inversePrecedence: true) {
    node('slave') {
      try {
        stage('Checkout') {
          deleteDir()
          checkout scm
          dir('ansible-management') {
            git url: "https://github.com/hmcts/ansible-management", branch: "master", credentialsId: "jenkins-public-github-api-token"
          }
        }

        stage('Setup') {
          sh '''
            yarn install
          '''
        }

        // Responsible for compiling using webpack
        stage('CompileJS') {
          sh '''
            yarn build
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
            notifyBuildResult channel: '#bar-tech', color: 'warning',
              message: 'Node security check failed see the report for the errors'
          }
          sh "rm nsp-report.txt"
        }

        stage('Test') {
          try {
            sh "yarn test"
          } finally {
          }
        }
        
        stage('Acceptance Test') {
          try {
            sh "yarn test:acceptance"
          } finally {
          }
        }

        def barWebDockerVersion

      //  stage('Build Docker') {
      //    barWebDockerVersion = dockerImage imageName: 'bar/bar-web'
      //  }

        onMaster {
          def rpmVersion

          stage('Publish RPM') {
            rpmVersion = packager.nodeRPM('bar-web')
            packager.publishNodeRPM('bar-web')
          }

          stage('Deploy (Dev)') {
            ansible.runDeployPlaybook("{bar_version: ${rpmVersion}}", 'dev')
            RPMTagger rpmTagger = new RPMTagger(this, 'bar-web', packager.rpmName('bar-web', rpmVersion), 'cc-local')
            rpmTagger.tagDeploymentSuccessfulOn('dev')
          }

         stage('Deploy (Test)') {
          ansible.runDeployPlaybook("{bar_version: ${rpmVersion}}", 'test')
          RPMTagger rpmTagger = new RPMTagger(this, 'bar-web', packager.rpmName('bar-web', rpmVersion), 'cc-local')
          rpmTagger.tagDeploymentSuccessfulOn('test')
         }
        }
      } catch (Throwable err) {
        notifyBuildFailure channel: '#bar-tech'
        throw err
      }
    }
    milestone()
  }
}
