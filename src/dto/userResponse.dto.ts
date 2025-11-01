//userResponseDto

import { Exclude } from "class-transformer";

export class UserResponseDto{
    id:number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    @Exclude()
    hash: string;
    createdAt: Date;
    updatedAt: Date;
    token: string;
    
    constructor(partial: Partial<UserResponseDto>, token: string){
        Object.assign(this, partial);
        this.token= token;
    }
}
