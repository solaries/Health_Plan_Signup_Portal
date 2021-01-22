exports.Api = (statusCode, message = '') => {
  switch (statusCode) {
    case 400: {
      return { message: `Bad request ${message}`, statusCode };
    }
    case 401: {
      return { message: `Unauthorized. Please check your credentials. ${message}`, statusCode };
    }
    case 403: {
      return { message: `Expired/Invalid Sanbox Key. ${message}`, statusCode };
    }
    case 503: {
      return { message: `Service temporarily unavailable ${message}`, statusCode };
    }
    default: {
      return { message: `Error executing methodName, Please raise an issue on Github. ${message}`, statusCode: 500 };
    }
  }
};

exports.Module = (error) => ({
  message: 'Something went wrong, Please raise an issue on Github using the stack trace',
  error,
});
