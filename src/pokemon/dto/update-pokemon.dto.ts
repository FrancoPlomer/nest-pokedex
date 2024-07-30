import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';

//PartialType define que, update va a tener todas las definiciones del create pero opcionales

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
