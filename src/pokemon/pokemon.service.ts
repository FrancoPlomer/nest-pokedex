import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(

    @InjectModel( Pokemon.name )

    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ){
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {

      const pokemon = await this.pokemonModel.create( createPokemonDto );

      return pokemon;
    } catch (error) {

      this.handleExceptions( error );
    }
  }

  async findAll( paginationDto: PaginationDto ) {    

    const { 
      limit = this.defaultLimit, 
      offset = 0 
    } = paginationDto;

    return await this.pokemonModel.find()
    .limit( limit )
    .skip( offset );
  }

  async findOne(id: string) {

    let pokemon: Pokemon;

    if( !isNaN(+id) ) pokemon = (
      await this.pokemonModel.findOne({ nO: id })
    );

    if( isValidObjectId(id) ) pokemon = (
      await this.pokemonModel.findById( id )
    );

    if( !pokemon ) pokemon = (
      await this.pokemonModel.findOne({ name: id })
    )

    if( !pokemon ) throw new NotFoundException(`Pokemon whit key ${ id } not found`);

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( id );

    if( updatePokemonDto.name ) updatePokemonDto.name = (
      updatePokemonDto.name.toLowerCase()
    );

    try {
      await pokemon.updateOne( updatePokemonDto, { new: true } );

      return { ...pokemon.toJSON(), ...updatePokemonDto }
    } catch (error) {
      
      this.handleExceptions( error );
    };
  }

  async remove(id: string) {
    try {
      
      const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

      if( deletedCount === 0 ) {
        throw new BadRequestException(`Pokemon whit ${id} not found`)
      } 

      return `${id} deleted`;
    } catch (error) {
      
      this.handleExceptions( error );
    }
  }

  private handleExceptions( error: any ) {

    console.log(error);

    if( error.code === 11000 ) {

      throw new BadRequestException(`Pokemon exists in DB ${ JSON.stringify( error.keyValue ) }`);
    }

    throw new InternalServerErrorException( 'Can´t create a new pokemon, check the server logs' )
  }
}
