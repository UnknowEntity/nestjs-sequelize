import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [
    { name: 'kitty', age: 3, breed: 'white cat' },
    { name: 'yoda', age: 100, breed: 'alien' },
  ];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findOne(id: number) {
    return this.cats[id];
  }
}
