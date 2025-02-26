import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { SessionService } from './session/session.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private session: SessionService,
  ) {}

  async signup(dto: AuthDto) {
    const { email, name, password, role } = dto;

    // check is user is already exits
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exits');
    }

    const hashedPassword = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.session.createSession(user.id, expiresAt);

    return { message: 'User regirested successfully', userId: user.id };
  }

  async signin(dto: AuthDto, res: Response) {
    const { email, password } = dto;

    // Fetch user with only necessary fields
    const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, password: true, role: true }, // Fetch only required fields
    });

    if (!user) throw new UnauthorizedException("User doesn't exist");

    // Verify password & delete existing sessions in parallel
    const [passwordValid] = await Promise.all([
        argon2.verify(user.password, password),
        this.prisma.session.deleteMany({ where: { user_id: user.id } }),
    ]);

    if (!passwordValid) throw new UnauthorizedException('Invalid password');

    // Create a new session with expiration time
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    const newSession = await this.prisma.session.create({
        data: { user_id: user.id, expiresAt },
    });

    // Set secure cookie
    res.cookie('session_id', newSession.session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
    });

    return { message: 'Signed in successfully', userId: user.id, role: user.role };
}


  async signout(userId: string, res: Response) {
    const existingSession = await this.session.getSession(userId);
    if (!existingSession)
      throw new BadRequestException('No active session found');

    await this.session.deleteSession(existingSession.session_id);

    res.clearCookie('session_id');

    return { message: 'Signed out successfully' };
  }
}
