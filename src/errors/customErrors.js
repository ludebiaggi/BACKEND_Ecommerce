export default class CustomError {
  static createError(err) {
    if (err.status) {
      return {
        status: err.status,
        errors: [new Error(err.message, err.key)],
        message: err.message,
      };
    } else {
      return {
        status: 500,
        errors: [err],
      };
    };
  };
};