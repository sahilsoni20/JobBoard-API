import { Body, Controller, Post, Res, Session } from '@nestjs/common';
import { Response } from 'express'; // ✅ Import Response from express
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  async signin(
    @Body() dto: AuthDto,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.signin(dto, res);

      // ✅ Store both user ID and role in the session
      session.user = { id: result.userId, role: result.role };

      return res.json(result); // Ensure proper response format
    } catch (error) {
      console.error('Signin error:', error);
      return res.status(401).json({ message: error.message || 'Unauthorized' });
    }
  }

  @Post('signout')
  async signout(@Body() dto: { userId: string }, @Res() res: Response) {
    return this.authService.signout(dto.userId, res);
  }
}
