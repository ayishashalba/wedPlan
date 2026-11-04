import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@wedplan.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'WedPlan Administrator';
    const adminPhone = process.env.ADMIN_PHONE || '+91 94000 00000';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log(`[Seed] Admin user '${adminEmail}' already exists. Updating password & role...`);
      admin.name = adminName;
      admin.phone = adminPhone;
      admin.password = adminPassword;
      admin.role = 'admin';
      admin.isActive = true;
      await admin.save();
      console.log(`[Seed] Admin user '${adminEmail}' updated successfully.`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        password: adminPassword,
        role: 'admin',
        isActive: true
      });
      console.log(`[Seed] Super Admin user '${adminEmail}' created successfully!`);
    }

    await mongoose.disconnect();
    console.log('[Seed] MongoDB disconnected. Seed completed.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
