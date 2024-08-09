import { UserModel, UserDocument, UserRole } from '../models/User';
import configsEnv from '../configs/configs.env';

export const createAdminUser = async (): Promise<void> => {
  try {
    const adminUser = await UserModel.findOne({
      email: configsEnv.ADMIN_USER_EMAIL,
    });

    if (!adminUser) {
      const newAdminUser: UserDocument = new UserModel({
        email: configsEnv.ADMIN_USER_EMAIL,
        password: configsEnv.ADMIN_USER_PASSWORD,
        name: 'Admin',
        surname: 'Supper',
        role: UserRole.admin,
      });

      await newAdminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};
