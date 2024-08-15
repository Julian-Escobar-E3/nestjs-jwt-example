import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /**Definimos con jwtFromRequest cómo se extrae el token JWT de la solicitud.
       * En este caso, se extrae del header Authorization usando el esquema Bearer. */
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { id_user } = payload;

    const user = await this.userRepository.findOneBy({ id_user });

    if (!user) throw new UnauthorizedException('Not valid token');

    if (!user.isActive)
      throw new UnauthorizedException('User not active talk with an admin');

    return user;
  }
}
