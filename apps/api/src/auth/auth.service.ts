import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private prisma: any,
		private jwtService: JwtService,
	) {}

	async register(dto: RegisterDto) {
		// Check if organizer already exists
		const existing = await this.prisma.organizer.findUnique({
			where: { email: dto.email },
		});
		if (existing) {
			throw new ConflictException('Email already registered');
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(dto.password, 10);

		// Create organizer
		const organizer = await this.prisma.organizer.create({
			data: {
				email: dto.email,
				password: hashedPassword,
			},
		});

		// Generate JWT
		const payload = { sub: organizer.id, email: organizer.email };
		return {
			access_token: await this.jwtService.signAsync(payload),
			organizer: { id: organizer.id, email: organizer.email },
		};
	}

	async login(dto: LoginDto) {
		const organizer = await this.prisma.organizer.findUnique({
			where: { email: dto.email },
		});

		if (!organizer) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(dto.password, organizer.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { sub: organizer.id, email: organizer.email };
		return {
			access_token: await this.jwtService.signAsync(payload),
			organizer: { id: organizer.id, email: organizer.email },
		};
	}
}
