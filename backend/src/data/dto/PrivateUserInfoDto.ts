import UserInfoDto from "data/dto/UserInfoDto";
import RestrictionReadDto from "data/dto/RestrictionReadDto";

export default interface PrivateUserInfoDto extends UserInfoDto {
    readonly restrictions: RestrictionReadDto[]
}
