/**
 * Create Admin User Script
 * 
 * Creates an admin user with email/password login
 * Run with: bun run scripts/create-admin.ts
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('👤 Creating Admin User for Fikrago Gardening');
  console.log('=============================================');
  
  const adminEmail = 'admin@fikrago.com';
  const adminPassword = 'cnss2031';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  try {
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    
    if (existingAdmin) {
      // Update existing admin
      const updated = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          name: 'Admin',
          emailVerified: new Date(),
        },
      });
      console.log('✅ Admin user updated:');
      console.log(`   Email: ${updated.email}`);
      console.log(`   Role: ${updated.role}`);
    } else {
      // Create new admin
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin',
          role: 'ADMIN',
          emailVerified: new Date(),
        },
      });
      console.log('✅ Admin user created:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
    }
    
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('=============================================');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('');
    console.log('📌 You can now login at: /auth/signin');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
