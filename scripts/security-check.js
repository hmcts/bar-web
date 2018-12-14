/* eslint-disable */
const { exec } = require('child_process');

(function runAudit() {
  exec('yarn audit', (error, stdout, stderr) => {
    console.log(stdout);
    if (error) {
      const lines = stdout.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('Severity: ') && lines[i].includes('High')) {
          throw new Error('Security check failed');
        } else if (lines[i].startsWith('Severity: ') && !lines[i].includes('High')) {
          return;
        }
      }
      throw new Error(`Some error occured:\n${stderr}`)
    }
  });
}());