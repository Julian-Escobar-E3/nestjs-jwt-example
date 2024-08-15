import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from './dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    const datos = await this.userRepository.find();
    return datos;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(newUser);

      const user = plainToInstance(User, newUser);

      return { ...user, token: this.getJwt({ id_user: newUser.id_user }) };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, username } = loginUserDto;
    const loginUser = await this.userRepository.findOne({
      where: { username },
      select: { username: true, id_user: true, password: true },
    });

    if (!loginUser) {
      throw new UnauthorizedException('Not valid credentials (username)');
    }

    if (!bcrypt.compareSync(password, loginUser.password))
      throw new UnauthorizedException('Not valid credentials (password)');
    const user = plainToInstance(User, loginUser);

    return { ...user, token: this.getJwt({ id_user: loginUser.id_user }) };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwt({ id_user: user.id_user }),
    };
  }

  getJwt(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
