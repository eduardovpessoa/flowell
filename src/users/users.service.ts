import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/auth/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  async inactivate(id: number): Promise<void> {
    await this.usersRepository.update(id, {isActive: false});
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const user = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = await bcrypt.hash(createUserDto.password, saltOrRounds);
    await this.usersRepository.save(user);
  }
}