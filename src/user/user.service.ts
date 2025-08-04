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
    const existingSuperAdmins = await this.prismaService.user.findMany({
      where: { role: Roles.SUPERADMIN },
    });

    if (existingSuperAdmins.length > 0) {
      console.log('❗ Super admin allaqachon mavjud');
      return existingSuperAdmins[0];
    }
    // const hashedRefreshToken = 
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
        language_id:1
      },
    });

    console.log('✅ Super admin yaratildi');
    return superAdmin;
  }

  async create(createUserDto: CreateUserDto) {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prismaService.user.create({
      data: {
        full_name,
        phone,
        email,
        password: hashedPassword,
        is_verified: false,
        status: Status.INACTIVE, 
        role,
        activationLink: uuidv4(),
      },
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({ where: { id } });
  }

  async findUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async updateRefreshToken(id: number, hashedRefreshToken: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('Foydalanuvchi topilmadi');

    return await this.prismaService.user.update({
      where: { id },
      data: { hashedRefreshToken },
    });
  }
}
