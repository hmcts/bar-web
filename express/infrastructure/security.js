/* eslint-disable max-lines */
'use strict';

const { Logger } = require('@hmcts/nodejs-logging');

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const request = require('superagent');
const URL = require('url');
const UUID = require('uuid/v4');

const constants = Object.freeze({
  SECURITY_COOKIE: '__auth-token',
  REDIRECT_COOKIE: '__redirect',
  USER_COOKIE: '__user-info'
});

const ACCESS_TOKEN_OAUTH2 = 'access_token';

function Security(options) {
  this.opts = options || {};

  if (!this.opts.loginUrl) {
    throw new Error('login URL required for Security');
  }
}

/* --- INTERNAL --- */

function addOAuth2Parameters(url, state, self, req) {
  url.query.response_type = 'code';
  url.query.state = state;
  url.query.client_id = self.opts.clientId;
  url.query.redirect_uri = `${req.protocol}://${req.get('host')}${self.opts.redirectUri}`;
}

function generateState() {
  return UUID();
}

function storeRedirectCookie(req, res, continueUrl, state) {
  const url = URL.parse(continueUrl);
  const cookieValue = { continue_url: url.path, state };
  if (req.protocol === 'https') {
    res.cookie(constants.REDIRECT_COOKIE, JSON.stringify(cookieValue),
      { secure: true, httpOnly: true });
  } else {
    res.cookie(constants.REDIRECT_COOKIE, JSON.stringify(cookieValue),
      { httpOnly: true });
  }
}

function login(req, res, roles, self) {
  const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const state = generateState();

  storeRedirectCookie(req, res, originalUrl, state);

  let url = null;

  if (roles.includes('letter-holder')) {
    url = URL.parse(`${self.opts.loginUrl}/pin`, true);
  } else {
    url = URL.parse(self.opts.loginUrl, true);
  }

  addOAuth2Parameters(url, state, self, req);

  res.redirect(url.format());
}

function denyAccess(res, msg) {
  Logger.getLogger('BAR-WEB: security.js -> denyAccess()').info(JSON.stringify(msg));
  res.redirect('/error/401');
}

function forbidAccess(res, msg) {
  Logger.getLogger('BAR-WEB: security.js -> forbidAccess()').info(JSON.stringify(msg));
  res.redirect('/error/403');
}

function authorize(req, res, next, self) {
  if (req.roles !== null) {
    for (const role in self.roles) {
      if (req.roles.includes(self.roles[role])) {
        res.cookie(constants.USER_COOKIE, JSON.stringify(req.userInfo));
        return next();
      }
    }
  }

  return forbidAccess(res, `ERROR: Access forbidden - User does not have any of ${self.roles}. Actual roles:${req.roles}`);
}

function getTokenFromCode(self, req) {
  const url = URL.parse(`${self.opts.apiUrl}/oauth2/token`, true);

  return request.post(url.format())
    .auth(self.opts.clientId, self.opts.clientSecret)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({ grant_type: 'authorization_code' })
    .send({ code: req.query.code })
    .send({ redirect_uri: `${req.protocol}://${req.get('host')}${self.opts.redirectUri}` });
}

function getUserDetails(self, securityCookie) {
  return request.get(`${self.opts.apiUrl}/details`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${securityCookie}`);
}

function storeCookie(req, res, token) {
  req.authToken = token;

  if (req.protocol === 'https') { /* SECURE */
    res.cookie(constants.SECURITY_COOKIE, req.authToken, { secure: true, httpOnly: true });
  } else {
    res.cookie(constants.SECURITY_COOKIE, req.authToken, { httpOnly: true });
  }
}

function handleCookie(req) {
  if (req.cookies && req.cookies[constants.SECURITY_COOKIE]) {
    req.authToken = req.cookies[constants.SECURITY_COOKIE];
    return req.authToken;
  }

  return null;
}

Security.prototype.logout = function logout() {
  const self = { opts: this.opts };

  // eslint-disable-next-line no-unused-vars
  return function ret(req, res, next) {
    const token = req.cookies[constants.SECURITY_COOKIE];

    res.clearCookie(constants.SECURITY_COOKIE);
    res.clearCookie(constants.REDIRECT_COOKIE);
    res.clearCookie(constants.USER_COOKIE);

    if (token) {
      res.redirect(`${self.opts.loginUrl}/logout?jwt=${token}`);
    } else {
      res.redirect(`${self.opts.loginUrl}/logout`);
    }
  };
};

function protectImpl(req, res, next, self) {
  let securityCookie = null;
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  if (process.env.NODE_ENV === 'development') {
    if (req.method === 'OPTIONS') {
      return next();
    }
    req.cookies[constants.SECURITY_COOKIE] = req.header('Auth-Dev');
  }
  securityCookie = handleCookie(req);

  if (!securityCookie) {
    return login(req, res, self.roles, self);
  }

  return getUserDetails(self, securityCookie).end(
    (err, response) => {
      if (err) {
        if (!err.status) {
          err.status = 500;
        }

        switch (err.status) {
        case UNAUTHORIZED:
          return login(req, res, self.roles, self);
        case FORBIDDEN:
          return forbidAccess(res, 'Access Forbidden');
        default:
          return next({ status: err.status, details: JSON.stringify(err) });
        }
      }

      req.roles = response.body.roles;
      req.userInfo = response.body;
      return authorize(req, res, next, self);
    });
}

Security.prototype.protect = function protect(role) {
  const self = {
    roles: [role],
    new: false,
    opts: this.opts
  };

  return function ret(req, res, next) {
    protectImpl(req, res, next, self);
  };
};

Security.prototype.protectWithAnyOf = function protectWithAnyOf(roles) {
  const self = {
    roles,
    new: false,
    opts: this.opts
  };

  return function ret(req, res, next) {
    protectImpl(req, res, next, self);
  };
};

Security.prototype.protectWithUplift = function protectWithUplift(role, roleToUplift) {
  const self = {
    role,
    roleToUplift,
    new: false,
    opts: this.opts
  };

  return function ret(req, res, next) {
    /* Read the value of the token from the cookie */
    const securityCookie = handleCookie(req);

    if (!securityCookie) {
      return login(req, res, self.role, self);
    }

    return getUserDetails(self, securityCookie)
      .end((err, response) => {
        if (err) {
          /* If the token is expired we want to go to login.
          * - This invalidates correctly sessions of letter users that does not exist anymore
          */
          if (err.status === UNAUTHORIZED) {
            return login(req, res, [], self);
          }
          return denyAccess(res, `${err}: ${response.text}`);
        }

        req.roles = response.body.roles;
        req.userInfo = response.body;

        if (req.roles.includes(self.role)) { /* LOGGED IN ALREADY WITH THE UPLIFTED USER */
          return next();
        }

        if (!req.roles.includes(self.roleToUplift)) {
          return denyAccess(res, 'This user can not uplift');
        }

        /* REDIRECT TO UPLIFT PAGE */
        const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        const state = generateState();
        storeRedirectCookie(req, res, originalUrl, state);

        const url = URL.parse(`${self.opts.loginUrl}/uplift`, true);
        addOAuth2Parameters(url, state, self, req);
        url.query.jwt = securityCookie;

        return res.redirect(url.format());
      });
  };
};

function getRedirectCookie(req) {
  if (!req.cookies[constants.REDIRECT_COOKIE]) {
    return null;
  }

  return JSON.parse(req.cookies[constants.REDIRECT_COOKIE]);
}

/* Callback endpoint */
Security.prototype.OAuth2CallbackEndpoint = function OAuth2CallbackEndpoint() {
  const self = { opts: this.opts };

  return function ret(req, res) {
    /* We clear any potential existing sessions first, as we want to start over even if we deny access */
    res.clearCookie(constants.SECURITY_COOKIE);
    res.clearCookie(constants.USER_COOKIE);

    /* We check that our stored state matches the requested one */
    const redirectInfo = getRedirectCookie(req);

    if (!redirectInfo) {
      return denyAccess(res, 'Redirect cookie is missing');
    }

    if (redirectInfo.state !== req.query.state) {
      return denyAccess(res, `States do not match: ${redirectInfo.state} is not ${req.query.state}`);
    }

    if (!redirectInfo.continue_url.startsWith('/')) {
      return denyAccess(res, `Invalid redirect_uri: ${redirectInfo.continue_url}`);
    }

    if (!req.query.code) {
      return res.redirect(redirectInfo.continue_url);
    }

    return getTokenFromCode(self, req).end((err, response) => { /* We ask for the token */
      if (err) {
        return denyAccess(res, err);
      }

      /* We store it in a session cookie */
      storeCookie(req, res, response.body[ACCESS_TOKEN_OAUTH2]);

      /* We delete redirect cookie */
      res.clearCookie(constants.REDIRECT_COOKIE);

      /* And we redirect back to where we originally tried to access */
      return res.redirect(redirectInfo.continue_url);
    });
  };
};

module.exports = {
  Security,
  constants
};
