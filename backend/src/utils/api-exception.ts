export default class ApiException extends Error{
    status_code:number;
    constructor(message:string){
        super(message);
    }
}

export class ApiInvalidInputException extends ApiException{
    constructor(message:string){
        super(message);
        this.status_code = 400;
    }
}

export class ApiDuplicateResourceException extends ApiException{
    constructor(message:string){
        super(message);
        this.status_code = 409;
    }
}

export class ApiResourceNotFoundException extends ApiException{
    constructor(message:string){
        super(message);
        this.status_code = 404;
    }
}

export class ApiPermissionException extends ApiException{
    constructor(message:string){
        super(message);
        this.status_code = 403;
    }
}

export class ApiTokenException extends ApiException{
    constructor(message:string){
        super(message);
        this.status_code = 401;
    }
}

export class ApiResourceLockedException extends ApiException{
    constructor(message:string){
        super(message);
        this.status_code = 423;
    }
}

export class ApiResourceOperationException extends ApiException{
    constructor(message:string){
        super(message);
        this.status_code = 500;
    }
}