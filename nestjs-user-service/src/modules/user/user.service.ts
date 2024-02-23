// Nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Vendor
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

// Src
import { ErrorMessage } from '@common/constants';
import { CreateUserDto, FindUserDto, UpdateUserDto } from '@common/dto';
import { User } from '@src/entities';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * @brief find user by name
   *
   * @param {string} name
   * @memberof UserService
   */
  findUserByName = async (name: string): Promise<User> => {
    const user = await this.userRepository.findOneBy({ name });
    return user;
  };

  /**
   * @brief find user by email
   *
   * @param {string} email
   * @memberof UserService
   */
  findUserByEmail = async (email: string): Promise<User> => {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  };

  /**
   * @brief find user by phone
   *
   * @param {string} phone
   * @memberof UserService
   */
  findUserByPhone = async (phone: string): Promise<User> => {
    const user = await this.userRepository.findOneBy({ phone });
    return user;
  };

  /**
   * @brief find user by user id
   *
   * @param {number} id
   * @memberof UserService
   */
  findUserById = async (id: number): Promise<User> => {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  };

  /**
   * @brief find user by username
   *
   * @param {string} username
   * @memberof UserService
   */
  findUserByUsername = async (username: string): Promise<User> => {
    const user = await this.userRepository.findOneBy({ username });
    return user;
  };

  /**
   * @brief find all user
   *
   * @memberof UserService
   */
  findAllUser = async (findUserDto: FindUserDto): Promise<User[]> => {
    const listUser = await this.userRepository
      .createQueryBuilder()
      .where(
        `is_deleted = :isDeleted AND
        (id = :id OR 
        name = :name OR 
        username = :username OR 
        email = :email OR 
        phone = :phone OR 
        age = :age OR 
        gender = :gender)`,
        {
          isDeleted: false,
          id: findUserDto.id,
          name: findUserDto.name,
          username: findUserDto.username,
          email: findUserDto.email,
          phone: findUserDto.phone,
          age: findUserDto.age,
          gender: findUserDto.gender,
        },
      )
      .offset(findUserDto.page ? findUserDto.page - 1 : null)
      .limit(findUserDto.limit ? findUserDto.limit : null)
      .getMany();
    return listUser;
  };

  /**
   * @brief create new user
   *
   * @param {CreateUserDto} createUserDto
   * @memberof UserService
   */
  createUser = async (createUserDto: CreateUserDto): Promise<User> => {
    try {
      const { password } = createUserDto;
      // email, phone, this.checkEmailPhoneExist(email, phone);
      const newUser = this.userRepository.create(createUserDto);
      newUser.bsalt = bcrypt.genSaltSync();
      newUser.password = bcrypt.hashSync(password, newUser.bsalt);
      newUser.resetPasswordToken = bcrypt.hashSync(
        crypto.randomBytes(32).toString('hex'),
        newUser.bsalt,
      );
      newUser.emailVerifyToken = bcrypt.hashSync(
        crypto.randomBytes(32).toString('hex'),
        newUser.bsalt,
      );
      console.log(
        '🚀 ~ file: user.service.ts:28 ~ UserService ~ createUser= ~ bsalt:',
        newUser,
      );
      const user = await this.userRepository.save(newUser);
      console.log('🚀 ~ UserService ~ createUser= ~ user:', user);
      return user;
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:131 ~ UserService ~ createUser= ~ error:',
        error,
      );
      throw error;
    }
  };

  /**
   * @brief update user data
   *
   * @param {UpdateUserDto} updateUserDto
   * @memberof UserService
   */
  updateUser = async (updateUserDto: UpdateUserDto): Promise<User> => {
    try {
      console.log(
        '🚀 ~ file: user.service.ts:24 ~ UserService ~ update ~ updateUserDto:',
        updateUserDto,
      );
      const { id, email, phone } = updateUserDto;
      const user: User = await this.findUserById(id);
      if (!user) {
        throw new RpcException(ErrorMessage.USER_NOT_FOUND);
      }
      this.checkEmailPhoneExist(email, phone);
      user.name = updateUserDto.name;
      user.email = updateUserDto.email;
      user.phone = updateUserDto.phone;
      user.age = updateUserDto.age;
      user.gender = updateUserDto.gender;
      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  };

  /**
   * @brief remove user
   *
   * @param {number} id
   * @memberof UserService
   */
  removeUser = async (id: number): Promise<boolean> => {
    try {
      const user: User = await this.findUserById(id);
      if (!user) {
        throw new RpcException(ErrorMessage.USER_NOT_FOUND);
      }
      user.isDeleted = true;
      const currentDate = new Date();
      user.deletedAt = currentDate;
      console.log(
        '🚀 ~ file: user.service.ts:173 ~ UserService ~ removeUser= ~ user:',
        user,
      );
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      throw error;
    }
  };

  /**
   * @brief check email & phone exist
   *
   * @param {string} [email]
   * @param {string} [phone]
   * @memberof UserService
   */
  checkEmailPhoneExist = async (email?: string, phone?: string) => {
    try {
      const isEmailExist = await this.userRepository.exist({
        where: { email },
      });
      if (isEmailExist) {
        throw new RpcException(ErrorMessage.USER_EMAIL_EXIST);
      }
      const isPhoneExist = await this.userRepository.exist({
        where: { phone },
      });
      if (isPhoneExist) {
        throw new RpcException(ErrorMessage.USER_PHONE_EXIST);
      }
    } catch (error) {
      throw error;
    }
  };
}
