import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findOne(id : number): Promise<Post | null> {
    return this.postsRepository.findOne({ where: {id}, relations: ['user'] });
  }

  findAll(user : User): Promise<Post[]> {
    return this.postsRepository.findBy({ user });
  }

  async inactivate(post : Post): Promise<void> {
    await this.postsRepository.save(post);
  }

  async create(user : User, createPostDto: CreatePostDto): Promise<void> {
    const post = new Post();
    post.title = createPostDto.title;
    post.text = createPostDto.text;
    post.user = user;
    await this.postsRepository.save(post);
  }
}
