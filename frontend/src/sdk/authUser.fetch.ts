import AuthResponse from "../../response/auth.response";
import ApiException from "../../response/exception.response";


export default class UserSdk{
    
    createUser(username:String, password:String): Promise<AuthResponse | ApiException> {
        
    }
}


