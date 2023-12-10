import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
     
      const { name, email, password } = signUpDto;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });
  
      if (!user) {
        throw new Error('User creation failed');
      }
 
      const token = this.jwtService.sign({ id: user._id });
      console.log('Token generated:', token);
  
      return { token };
    } catch (error) {
      console.error('Signup Error:', error);
      throw new InternalServerErrorException('Error during signup');
    }
  }
  

  async login(loginDto: LoginDto): Promise<{ token?: string; error?: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      return { error: 'Invalid email or password' };
    }
  
    const isPasswordMatched = await bcrypt.compare(password, user.password);
  
    if (!isPasswordMatched) {
      return { error: 'Invalid email or password' };
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
}
