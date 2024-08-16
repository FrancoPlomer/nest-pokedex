import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    
    @InjectModel( Pokemon.name )
    
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {
    
    try {
      
      await this.pokemonModel.deleteMany();

      const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')
      
      const pokemonToInsert: { name: string, nO: number }[] = [];

      data.results.forEach( async ({ name, url }) => {

        const segments = url.split('/')
        const nO  = +segments[ segments.length - 2 ]
        
        pokemonToInsert.push({ name, nO });

        await this.pokemonModel.insertMany( pokemonToInsert )
      })

      return data.results;
    } catch (error) {
      console.log(error);
      
    }
  }
}
