import UserDto from "data/dto/UserDto";

export default class UserVso {

    public id: number;
    public name: string;

    constructor(dto: UserDto) {
        this.id = dto.id;
        this.name = dto.name;
    }

}
