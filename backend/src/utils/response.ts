export default class ResponseEntity{
    data: Object;
    status_code: number;

    constructor(data: Object){
        this.data = data;
        this.status_code = 200;
    }
    

}