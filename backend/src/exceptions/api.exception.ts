enum StatusCode {
  BADREQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOTFOUND = 404,
}

export abstract class ApiException extends Error {
  status_code: StatusCode;
  constructor(message: string, status_code: StatusCode) {
    super(message);
    this.status_code = status_code;
  }

  toJson() {
    return {status_code: this.status_code, message: this.message};
  }
}

export class BadRequestException extends ApiException {
  constructor(message: string) {
    super(message, StatusCode.BADREQUEST);
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string) {
    super(message, StatusCode.UNAUTHORIZED);
  }
}

export class ForbiddenException extends ApiException {
  constructor(message: string) {
    super(message, StatusCode.FORBIDDEN);
  }
}

export class NotFoundException extends ApiException {
  constructor(message: string) {
    super(message, StatusCode.NOTFOUND);
  }
}
