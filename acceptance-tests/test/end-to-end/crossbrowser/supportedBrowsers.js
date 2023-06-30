const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 10';

/* eslint-disable object-curly-newline */
const supportedBrowsers = {
  microsoft: {
    /* edge_win_latest: {
      browserName: 'MicrosoftEdge',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Bar Web: Edge_Win10'
      }
    }*/
  },
  chrome: {
    chrome_win_latest: {
      browserName: 'chrome',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Bar Web: WIN_CHROME_LATEST'
      }
    },
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Bar Web: MAC_CHROME_LATEST'
      }
    }
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Bar Web: WIN_FIREFOX_LATEST'
      }
    },
    firefox_mac_latest: {
      browserName: 'firefox',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'Bar Web: MAC_FIREFOX_LATEST'
      }
    }
  }
};

module.exports = supportedBrowsers;
