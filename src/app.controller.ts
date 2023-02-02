import { Controller, Get, Request, Post, UseGuards, Body, HttpStatus, ValidationPipe, Delete, Response, Param } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CreatePostDto } from './posts/create-post.dto';
import { PostsService } from './posts/posts.service';
import { CreateUserDto } from './users/create-user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly postService: PostsService
  ) { }

  @Post('auth/register')
  async register(@Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
      return { status: HttpStatus.CREATED, data: { "message": "User created successfully" } }
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message }
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Response() res) {
    const token = await this.authService.login(req.user);
    return res.status(HttpStatus.OK).json(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  async listPosts(@Request() req, @Response() res) {
    const user = await this.userService.findOne(req.user.userId);
    const posts = await this.postService.findAll(user);
    return res.status(HttpStatus.OK).json(posts);
  }

  @UseGuards(JwtAuthGuard)
  @Post('posts')
  async createPost(@Request() req, @Body(new ValidationPipe({ transform: true })) createPostDto: CreatePostDto) {
    const user = await this.userService.findOne(req.user.userId);
    return this.postService.create(user, createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('posts/:id')
  async deletePost(@Param('id') id: number, @Request() req, @Response() res) {
    const post = await this.postService.findOne(id);
    if(post == null){
      return res.status(HttpStatus.NOT_FOUND);
    }
    if(post.user.id === req.user.userId){
      post.isActive = false;
      return this.postService.inactivate(post);
    }else{
      return res.status(HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}


