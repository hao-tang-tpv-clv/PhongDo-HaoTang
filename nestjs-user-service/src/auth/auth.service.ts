// Nest
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// Vendor
import * as bcrypt from 'bcrypt';
import { google, Auth } from 'googleapis';

// Src
import { ErrorMessage } from '@common/constants';
import {
  ChangePWDto,
  CreateUserDto,
  GoogleAuthDto,
  SignInDto,
  SignUpDto,
  UpdateUserDto,
} from '@common/dto';
import { UserService } from '@src/modules';
import { User } from '@src/entities';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  /**
   * @brief validate user with username and password
   *
   * @param {string} username
   * @param {string} password
   * @memberof AuthService
   */
  validateUser = async (username: string, password: string): Promise<User> => {
    try {
      const user = await this.userService.findUserByUsername(username);
      if (!user) {
        throw new HttpException(
          ErrorMessage.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (isPasswordMatching) {
        return user;
      } else {
        throw new HttpException(
          ErrorMessage.PASSWORD_WRONG,
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * @brief generate token
   *
   * @param {*} payload
   * @memberof AuthService
   */
  generateToken = async (payload: any): Promise<any> => {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: `60s`,
    });
  };

  /**
   * @brief generate return data
   *
   * @param {User} user
   * @memberof AuthService
   */
  genReturnData = async (user: User): Promise<any> => {
    return {
      email: user.email,
      name: user.name,
      username: user.username,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
    };
  };

  /**
   * @brief user sign in by username and password
   *
   * @param {SignInDto} signInDto
   * @memberof AuthService
   */
  signIn = async (signInDto: SignInDto) => {
    try {
      const { username, password } = signInDto;
      const user: User = await this.validateUser(username, password);
      if (user) {
        const result = this.genReturnData(user);
        return {
          jwtToken: this.generateToken(result),
        };
      }
    } catch (error) {
      throw new RpcException(error);
    }
  };

  /**
   * @brief register user
   *
   * @param {SignUpDto} signUpDto
   * @memberof AuthService
   */
  signUp = async (signUpDto: SignUpDto) => {
    try {
      const { password, confirmPassword, email, username } = signUpDto;
      if (password !== confirmPassword) {
        throw new HttpException(
          ErrorMessage.PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH,
          HttpStatus.BAD_REQUEST,
        );
      }
      const newUser: CreateUserDto = {
        email: email,
        username: username,
        password: password,
        name: '',
        phone: '',
        age: 0,
        gender: 'u',
      };
      const user = await this.userService.createUser(newUser);
      console.log(
        '🚀 ~ file: auth.service.ts:109 ~ AuthService ~ signUp= ~ user:',
        user,
      );
      // gửi email verify ở đây
      return true;
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:131 ~ UserService ~ createUser= ~ error:',
        error,
      );
      throw new RpcException(error);
    }
  };

  /**
   * @brief google login and check signup google here
   *
   * @memberof AuthService
   */
  googleSignIn = async (googleAuthDto: GoogleAuthDto) => {
    try {
      const { gtoken } = googleAuthDto;
      const tokenInfo = await this.oauthClient.getTokenInfo(gtoken);
      const { email } = tokenInfo;
      const user = await this.userService.findUserByEmail(email);
      let result = null;
      if (user) {
        result = this.genReturnData(user);
      } else {
        // Create user here
        const newUser: CreateUserDto = {
          email,
          username: email.split('@')[0],
          password: '',
          name: '',
          phone: '',
          age: 0,
          gender: '',
        };
        const createNewUser = await this.userService.createUser(newUser);
        result = this.genReturnData(createNewUser);
      }
      return {
        jwtToken: this.generateToken(result),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  };

  /**
   * @brief change user password
   *
   * @param {*} changePWDto
   * @memberof UserService
   */
  changePasswordUser = async (changePWDto: ChangePWDto) => {
    try {
      const { id, username, oldPassword, newPassword, confirmPassword } =
        changePWDto;
      if (newPassword !== confirmPassword) {
        throw new RpcException(
          ErrorMessage.PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH,
        );
      }
      const user: User = await this.validateUser(username, oldPassword);
      const { email, name, phone, age, gender } = user;
      if (user) {
        const updateUser: UpdateUserDto = {
          id,
          email,
          name,
          phone,
          age,
          gender,
          password: newPassword,
        };
        const user = await this.userService.updateUser(updateUser);
        return {
          user,
        };
      }
    } catch (error) {
      throw new RpcException(error);
    }
  };
}
