import { CustomError } from "./CustomError";

export class ServiceUnavailableError extends CustomError {
  statusCode = 503;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
