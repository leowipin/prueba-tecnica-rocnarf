import { MigrationInterface, QueryRunner } from "typeorm";
import { User, UserRole } from "../models/user.model";
import bcrypt from 'bcrypt';

export class SeedAdminUser1755348542556 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.manager.getRepository(User);

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminUsername = process.env.ADMIN_USERNAME;

        if (!adminEmail || !adminPassword || !adminUsername) {
            console.warn('ADVERTENCIA: Las variables de entorno del administrador (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME) no están configuradas. Saltando el seed del usuario admin.');
            return;
        }

        const adminExists = await userRepository.findOne({ where: { email: adminEmail } });
        if (adminExists) {
            console.log('El usuario administrador ya existe. Saltando seed.');
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        const adminUser = userRepository.create({
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword,
            role: UserRole.ADMIN,
        });

        await userRepository.save(adminUser);

        console.log('Usuario administrador creado exitosamente.');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.manager.getRepository(User);
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!adminEmail) {
            console.warn('ADVERTENCIA: La variable de entorno ADMIN_EMAIL no está configurada. No se puede revertir el seed del admin.');
            return;
        }

        const adminUser = await userRepository.findOne({ where: { email: adminEmail } });

        if (adminUser) {
            await userRepository.remove(adminUser);
            console.log('Usuario administrador eliminado exitosamente.');
        }
    }

}
