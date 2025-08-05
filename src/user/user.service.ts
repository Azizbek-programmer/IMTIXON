import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Roles, Status } from '../../generated/prisma';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async createSuperAdminData() {
    try {
      const existingSuperAdmins = await this.prismaService.user.findMany({
        where: { role: Roles.SUPERADMIN },
      });

      if (existingSuperAdmins.length > 0) {
        console.log('❗ Super admin allaqachon mavjud');
        return existingSuperAdmins[0];
      }

      const superAdmin = await this.prismaService.user.create({
        data: {
          full_name: 'Super Admin',
          email: 'admin@example.com',
          phone: '+998901112233',
          password: await bcrypt.hash('P@ssw0rd123', 10),
          status: Status.ACTIVE,
          role: Roles.SUPERADMIN,
          is_verified: true,
          activationLink: uuidv4(),
          language_id: 1
        },
      });

      console.log('✅ Super admin yaratildi');
      return superAdmin;
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { full_name, phone, email, password, confirm_password, role } = createUserDto;

      if (password !== confirm_password) {
        throw new BadRequestException('Parollar mos emas');
      }

      const existingEmail = await this.prismaService.user.findUnique({ where: { email } });
      if (existingEmail) {
        throw new BadRequestException('Bu email bilan foydalanuvchi allaqachon mavjud');
      }

      if (!Object.values(Roles).includes(role as Roles)) {
        throw new BadRequestException('Bunday role mavjud emas');
      }

      let userRole: Roles = Roles.CUSTOMER;
      if (role) {
        if (!Object.values(Roles).includes(role)) {
          throw new BadRequestException('Bunday role mavjud emas');
        }
        userRole = role;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      return await this.prismaService.user.create({
        data: {
          full_name,
          phone,
          email,
          password: hashedPassword,
          is_verified: false,
          status: Status.INACTIVE, 
          role: userRole,
          activationLink: uuidv4(),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prismaService.user.findMany();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.user.findUnique({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.user.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  async updateRefreshToken(id: number, hashedRefreshToken: string) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      if (!user) throw new BadRequestException('Foydalanuvchi topilmadi');

      return await this.prismaService.user.update({
        where: { id },
        data: { hashedRefreshToken },
      });
    } catch (error) {
      throw error;
    }
  }
}
