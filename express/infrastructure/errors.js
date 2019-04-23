const httpStatusCodes = require('http-status-codes');

class ApiCallError extends Error {
  setStatus(status) {
    this.status = status;
    return this;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setDetailedMessage(detailedMessage) {
    this.detailedMessage = detailedMessage;
    return this;
  }

  setRemoteError(remoteError) {
    this.remoteError = remoteError;
    return this;
  }

  setFileName(fileName) {
    this.fileName = fileName;
    return this;
  }

  toString() {
    let defaultToString = super.toString();
    if (this.fileName) {
      defaultToString += `file name: ${this.fileName}`;
    }
    if (this.status) {
      defaultToString += `status: ${this.status}`;
    }
    if (this.detailedMessage) {
      defaultToString += `details: ${this.detailedMessage}`;
    }
    if (this.remoteError) {
      defaultToString += `cause: ${this.remoteError}`;
    }
    return defaultToString;
  }
}

module.exports = {
  ApiCallError,
  ApiErrorFactory: fileName => {
    return {
      createServerError: (err, message = '500 - Internal Server Error') =>
        new ApiCallError(message)
          .setRemoteError(err)
          .setFileName(fileName)
          .setStatus(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .setTitle('500 - Internal Server Error')
          .setDetailedMessage('The server encountered an internal error or misconfiguration and was unable to complete your request'),
      createUnathorizedError: (err, message = '401 - Access Denied') =>
        new ApiCallError(message)
          .setRemoteError(err)
          .setFileName(fileName)
          .setStatus(httpStatusCodes.UNAUTHORIZED)
          .setTitle('401 - Access Denied')
          .setDetailedMessage('This server could not verify that you are authorized to access the document requested'),
      createForbiddenError: (err, message = '403 - Forbidden') =>
        new ApiCallError(message)
          .setRemoteError(err)
          .setFileName(fileName)
          .setStatus(httpStatusCodes.FORBIDDEN)
          .setTitle('403 - Forbidden')
          .setDetailedMessage('You do not have permission to retrieve the URL or link you requested')
    };
  }
};
