import { Request, Response } from 'express';
import { UserModel } from './models';
import { User } from './interfaces';
import { userValidationSchema, orderValidationSchema } from './zoidvalidation';

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    try {
      const validatedData = userValidationSchema.parse(req.body);
      const newUser = new UserModel(validatedData);
      const savedUser = await newUser.save();
      // Avoid exposing sensitive information like passwords in the response
      const responseUser: User = {
        ...savedUser.toObject(),
        password: '********',
      };
      res.status(201).json({
        success: true,
        message: 'User created successfully!',
        data: responseUser,
      });
    } catch (error) {
      // Handle validation errors
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: {
          code: 400,
          description: 'Failed to create user',
        },
      });
    }
  } catch (error) {
    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: {
        code: 500,
        description: 'Failed to create user',
      },
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await UserModel.find(
      {},
      'username fullName age email address -_id',
    );
    const responseUsers = users.map((user) => ({
      username: user.username,
      fullName: user.fullName,
      age: user.age,
      email: user.email,
      address: user.address,
    }));
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: responseUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: {
        code: 500,
        description: 'Failed to fetch users',
      },
    });
  }
};
