export default class MyResponse{
    data: JSON;
    status_code:Number = 200;
    msg: String = "Operation Successful.";
    // err_code: String = '';

    constructor(data:JSON){
        this.data = data;
        // this.status_code = status_code;
        // this.msg = msg;
        // this.err_code = err_code;
    }
    
    build(this:MyResponse){
        return {
            "msg": this.msg,
            "data": this.data,
            "status_code": this.status_code
        }
    }

}