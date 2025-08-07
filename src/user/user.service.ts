import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Roles, Status } from '../../generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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
          email: 'super@gmail.com',
          phone: '+998901112233',
          password: await bcrypt.hash('super1', 10),
          status: Status.ACTIVE,
          role: Roles.SUPERADMIN,
          is_verified: true,
          activationLink: uuidv4(),
          language_id: 1,
        },
      });

      console.log('✅ Super admin yaratildi');
      return superAdmin;
    } catch (error) {
      throw error;
    }
  }

  async createAdminData() {
  try {
    const existingAdmins = await this.prismaService.user.findMany({
      where: { role: Roles.ADMIN },
    });

    if (existingAdmins.length > 0) {
      console.log('❗ Admin allaqachon mavjud');
      return existingAdmins[0];
    }

    const admin = await this.prismaService.user.create({
      data: {
        full_name: 'Admin User',
        email: 'admin@gmail.com',
        phone: '+998901112234',
        password: await bcrypt.hash('Admin1', 10),
        status: Status.ACTIVE,
        role: Roles.ADMIN,
        is_verified: true,
        activationLink: uuidv4(),
        language_id: 1,
      },
    });

    console.log('✅ Admin yaratildi');
    return admin;
  } catch (error) {
    throw error;
  }
}

async createWorkerData() {
  try {
    const existingWorkers = await this.prismaService.user.findMany({
      where: { role: Roles.WORKER },
    });

    if (existingWorkers.length > 0) {
      console.log('❗ Worker allaqachon mavjud');
      return existingWorkers[0];
    }

    const worker = await this.prismaService.user.create({
      data: {
        full_name: 'Worker User',
        email: 'worker@gmail.com',
        phone: '+998901112235',
        password: await bcrypt.hash('worker1', 10),
        status: Status.ACTIVE,
        role: Roles.WORKER,
        is_verified: true,
        activationLink: uuidv4(),
        language_id: 1,
      },
    });

    console.log('✅ Worker yaratildi');
    return worker;
  } catch (error) {
    throw error;
  }
}


  async create(createUserDto: CreateUserDto) {
    try {
      const { full_name, phone, email, password, confirm_password, role } =
        createUserDto;

      if (password !== confirm_password) {
        throw new BadRequestException('Parollar mos emas');
      }

      const existingEmail = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        throw new BadRequestException(
          'Bu email bilan foydalanuvchi allaqachon mavjud',
        );
      }

      const userRole: Roles = role ?? Roles.CUSTOMER;

  // if (role) {
  //   const upperRole = role.toUpperCase(); // "admin" -> "ADMIN"
  //   if (!Object.values(Roles).includes(upperRole as Roles)) {
  //     throw new BadRequestException('Bunday role mavjud emas');
  //   }
  //   userRole = upperRole as Roles;
  // }

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
      const oldUser = await this.prismaService.user.findUnique({
        where: { id },
      });
      if (!oldUser) throw new NotFoundException('User topilmadi');

      (Request as any).oldEntity = oldUser;

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
      const oldUser = await this.prismaService.user.findUnique({
        where: { id },
      });
      if (!oldUser) throw new NotFoundException('User topilmadi');

      (Request as any).oldEntity = oldUser;

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
