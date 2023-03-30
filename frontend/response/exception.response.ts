import { ErrorMessage } from "../src/utils/enum";

export function parseError(errorMessage){
    switch(errorMessage){
    case ErrorMessage.AUTHNOHEADER:
        return 'No auth header';
    case ErrorMessage.AUTHUNAUTHORIZED:
        return 'Unauthorized';
    case ErrorMessage.AUTHWRONGHEADER:
        return 'Wrong auth header';
    case ErrorMessage.BADPASSWORDREQ:
        return 'Bad password';
    case ErrorMessage.BADUSERNAMEREQ:
        return 'Bad username';
    case ErrorMessage.DEFAULTERROR:
        return 'Default error';
    case ErrorMessage.DUPLICATEUSER:
        return 'User already exists';
    case ErrorMessage.FORBIDDENUPDATEUSER:
        return 'No permission to operate';
    case ErrorMessage.WRONGPASSWORD:
        return 'Wrong password';
    case ErrorMessage.WRONGUSERNAME:
        return 'Wrong username';
    case ErrorMessage.EMPTYMESSAGE:
        return 'Empty message';
    case ErrorMessage.ROOMIDNOTFOUND:
        return 'Wrong room';
    default:
        return '';
    }
    
}