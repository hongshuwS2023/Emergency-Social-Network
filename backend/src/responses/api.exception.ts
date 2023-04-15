export enum StatusCode {
  BADREQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOTFOUND = 404,
  DUPLICATE = 409,
}

export enum ErrorMessage {
  DEFAULTERROR = 'Default error',
  AUTHNOHEADER = 'Error generated by auth middleware: Header not found.',
  AUTHWRONGHEADER = 'Error generated by auth middleware: Header malformed.',
  AUTHUNAUTHORIZED = 'Error generated by auth middleware: Token wrong or expired, unauthorized.',
  BADUSERNAMEREQ = 'Error generated by service: Username not follow the rule, please provide another username.',
  BADPASSWORDREQ = 'Error generated by service: Password not follow the rule, please provide another password.',
  WRONGUSERNAME = 'Error generated by service: User does not exist.',
  WRONGPASSWORD = 'Error generated by service: Password wrong, please check the password.',
  DUPLICATEUSER = 'Error generated by DB query: Username already exists, please change a username.',
  FORBIDDENUPDATEUSER = 'Error generated by role permission: No permission to update user profile.',
  EMPTYMESSAGE = 'Error generated by service: Message cannot be empty or only space.',
  ROOMIDNOTFOUND = 'Error generated by service: Room ID cannot be found.',
  SPEEDTESTNOTFOUND = 'Error generated by service: Speedtest ID cannot be found.',
  ONGOINGSPEEDTEST = 'Error generated by speedtest middleware: On going speed test, please try again later.',
  WRONGSTATUS = 'Error generated by service: Cannot find corresponding status name.',
  BADSEARCHCRITERIA = 'Error generated by service: Search criteria not follow the rule.',
  NOSUCHEMERGENCYMESSAGE = 'Error generated by service: No such emergency message.',
  EXISTINGMESSAGE = 'Error generated by service: Existing unsent emergency message',
  USERNOTFOUND = 'Error generated by service: No such user.',
  WRONGROLE = 'Error generated by auth middleware: Role not permitted.',
  ATLEASTONEADMIN = 'Error generated by service: Need at least one admin.',
  INACTIVEUSER = 'Error generated by service: account not active.',
}

export abstract class ApiException extends Error {
  status_code: StatusCode;
  error_message: ErrorMessage = ErrorMessage.DEFAULTERROR;
  constructor(message: ErrorMessage, status_code: StatusCode) {
    super(message);
    this.error_message = message;
    this.status_code = status_code;
  }

  toJson() {
    return {
      status_code: this.status_code,
      message: this.error_message,
    };
  }
}

export class BadRequestException extends ApiException {
  constructor(message: ErrorMessage) {
    super(message, StatusCode.BADREQUEST);
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: ErrorMessage) {
    super(message, StatusCode.UNAUTHORIZED);
  }
}

export class ForbiddenException extends ApiException {
  constructor(message: ErrorMessage) {
    super(message, StatusCode.FORBIDDEN);
  }
}

export class NotFoundException extends ApiException {
  constructor(message: ErrorMessage) {
    super(message, StatusCode.NOTFOUND);
  }
}

export class DuplicateResourceException extends ApiException {
  constructor(message: ErrorMessage) {
    super(message, StatusCode.DUPLICATE);
  }
}
