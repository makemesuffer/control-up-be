import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';

const firstNames = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Richard',
  'Joseph',
  'Thomas',
  'Christopher',
  'Charles',
  'Daniel',
  'Matthew',
  'Anthony',
  'Mark',
  'Donald',
  'Steven',
  'Paul',
  'Andrew',
  'Joshua',
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'Elizabeth',
  'Barbara',
  'Susan',
  'Jessica',
  'Sarah',
  'Karen',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
];

const domains = ['example.com', 'test.org', 'demo.net', 'sample.io'];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomUser() {
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const domain = getRandomItem(domains);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;

  return {
    name: `${firstName} ${lastName}`,
    email,
  };
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rolesService = app.get(RolesService);
  const usersService = app.get(UsersService);

  try {
    await rolesService.initializeDefaultRoles();
    const rolesData = await rolesService.findAll();

    const existingUsers = await usersService.findAll();

    if (existingUsers.users.length > 0) {
      console.log(`Skipping user creation.`);
    } else {
      for (let i = 0; i < 25; i++) {
        const userData = generateRandomUser();
        const randomRoleIds: number[] = [];

        if (Math.random() < 0.6) {
          const viewerId = rolesData.roles.find((r) => r.name === 'viewer')?.id;
          if (viewerId) randomRoleIds.push(viewerId);
        }

        if (Math.random() < 0.3) {
          const editorId = rolesData.roles.find((r) => r.name === 'editor')?.id;
          if (editorId) randomRoleIds.push(editorId);
        }

        if (Math.random() < 0.1) {
          const adminId = rolesData.roles.find((r) => r.name === 'admin')?.id;
          if (adminId) randomRoleIds.push(adminId);
        }

        if (randomRoleIds.length === 0) {
          const viewerId = rolesData.roles.find((r) => r.name === 'viewer')?.id;
          if (viewerId) randomRoleIds.push(viewerId);
        }

        await usersService.create({
          ...userData,
          roleIds: randomRoleIds,
        });
      }
    }
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

void seed();
