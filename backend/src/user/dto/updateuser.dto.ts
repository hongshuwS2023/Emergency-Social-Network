import { Role, Status } from "../user.entity";

export interface UpdateUserDto {
    id: number;
    username?: string;
    password?: string;
    role?: Role;
    status?: Status;
}