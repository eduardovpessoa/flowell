import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(user : any): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async inactivate(id: number, user : any): Promise<void> {
    await this.postsRepository.update(id, {isActive: false});
  }

  async create(user : any, createPostDto: CreatePostDto): Promise<void> {
    const post = new Post();
    post.title = createPostDto.title;
    post.text = createPostDto.text;
    post.user = user;
    await this.postsRepository.save(post);
  }
}
