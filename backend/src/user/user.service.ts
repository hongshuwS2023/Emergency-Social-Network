import { Repository } from "typeorm";
import { ApiResourceNotFoundException } from "../utils/api-exception";
import ESNDataSource from "../utils/data-source";
import { CreateUserDto } from "./dto/createuser.dto";
import { UpdateUserDto } from "./dto/updateuser.dto";
import { Role, Status, User } from "./user.entity";

export default class UserService {
    userRepository: Repository<User>;

    constructor() {
        this.userRepository = ESNDataSource.getRepository(User);
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        console.log(createUserDto);
        const newUser = new User();
        newUser.username = createUserDto.username;
        newUser.password = createUserDto.password;
        newUser.role = Role.CITIZEN;
        newUser.status = Status.Undefined;

        return this.userRepository.save(newUser);
    }

    async getUser(userid: number): Promise<User> {
        try {
            const user = await this.userRepository.findOneByOrFail({ id: userid });
            return user;
        }
        catch (error: any) {
            throw new ApiResourceNotFoundException(error.message);
        }
    }

    async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.getUser(updateUserDto.id);

            user.username = updateUserDto.username ? updateUserDto.username : user.username;
            user.password = updateUserDto.password ? updateUserDto.password : user.password;
            user.role = updateUserDto.role ? updateUserDto.role : user.role;
            user.status = updateUserDto.status ? updateUserDto.status : user.status;

            return this.userRepository.save(user);
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }

    async deleteUser(userId: number): Promise<boolean> {
        const res = await this.userRepository.delete({id: userId});
        return true;
    }

}