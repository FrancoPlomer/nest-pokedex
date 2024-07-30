import { 
    Min, 
    IsInt, 
    IsString, 
    MinLength, 
    IsPositive, 
} from "class-validator";

export class CreatePokemonDto {

    @IsInt()
    @IsPositive()
    @Min(1)
    nO: number;

    @IsString()
    @MinLength(1)
    name: string;

}
