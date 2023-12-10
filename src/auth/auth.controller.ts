import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('signup')
  @Render('signup')
  signUpForm(): void {}

  @Post('signup')
  @Redirect('/auth/login')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res): Promise<void> {
    try {
      await this.authService.signUp(signUpDto);
      // res.redirect('/auth/login');
    } catch (error) {
      console.error('Signup Error:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Get('login')
  @Render('login')
  loginForm(): void {}

  @Post('login')
  // @Redirect('/auth/dashboard')
  async login(@Body() loginDto: LoginDto, @Res() res): Promise<void> {
    try {
      const result = await this.authService.login(loginDto);
      console.log('Login Result:', result);
      if (result.error) {
        console.log('Login Error:', result.error);
        res.render('login', { message: result.error });
        return;
      } else {
        res.cookie('jwt', result.token);
        res.redirect('/auth/dashboard');
      }
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Get('dashboard')
  @Render('dashboard')
  dashboard(): void {}

  @Get('logout')
  logout(@Req() req, @Res() res: Response): void {
    res.setHeader('Cache-Control', 'no-store');

    (res as any).clearCookie('jwt');

    (res as any).redirect('/auth/login');
  }
}
