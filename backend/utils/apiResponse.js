class ApiResponse {
    constructor(statusCode,data,message){
        this.statusCode = statusCode
        this.message = message
        this.success = statusCode<400 

        Object.assign(this, data);
    }
}

export {ApiResponse}