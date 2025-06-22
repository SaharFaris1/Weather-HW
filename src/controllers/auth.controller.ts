// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import userModel from '../model/user.model';
// import bcrypt from 'bcrypt';


// const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// //  تسجيل مستخدم جديد
// export const signUp = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password, role = 'user' } = req.body;

//     if (!email || !password) {
//       res.status(400).json({ 
//         error: 'All Field required'
//      });
//       return;
//     }

//     const existing = await userModel.findOne({ email });
//     if (existing) {
//       res.status(400).json({
//          error: 'Email already registered'
//          });
//       return;
//     }
//  // تشفير الباسوورد 
//     const passwordHash = await bcrypt.hash(password, 10);

//     const newUser = await userModel.create({
//       email,
//       passwordHash,
//       role
//     });
//     // إنشاء توكن للمستخدم الجديد
//     const token = jwt.sign(
//       { userId: newUser._id, role: newUser.role },
//       JWT_SECRET,
//       { expiresIn: '30m' }
//     );

//     res.status(201).json({
//       message: 'User created successfully',
//       userId: newUser._id,
//       token
//     });
//   } catch (err: any) {
//     res.status(500).json({
//          error: 'Failed to sign up',
//            });
//   }
// };

// //  تسجيل المستخدم
// export const signIn = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       res.status(400).json({ 
//         error: 'All Fields are required'
//      });
//       return;
//     }

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       res.status(401).json({ 
//         error:  'Invalid email'
//      });
//       return;
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
//     if (!isPasswordValid) {
//       res.status(401).json({
//          error: 'Invalid password' 
//         });
//       return;
//     }
//     // إنشاء توكن للمستخدم
//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       JWT_SECRET,
//       { 
//         expiresIn: '30m'
//      }
//     );

//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ 
//         error: 'Signin failed' 
//     });
//   }
// };

// export const signOut = async (req: Request, res: Response): Promise<void> => {
 
//   res.json({
//      message: 'Signed out successfully'
//      });
// };\

import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';
import { AppError } from '../utils/error';
import { AuthRequest } from '../middleware/auth.middleware';
import { dev } from '../utils/helpers';
import { CREATED, OK } from '../utils/http-status';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken} = await AuthService.signUp({
      email,
      password,
    });

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: !dev,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    
    res.status(CREATED).json({
      status: 'success',
      data: {
        // Remove password from output
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password} = req.body;

    const { user, accessToken } = await AuthService.signIn(
      email,
      password
    );

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: !dev,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });


    res.status(OK).json({
      status: 'success',
      data: {
        // Remove password from output
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req: Request, res: Response) => {
  res.cookie('accessToken', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });


  res.status(OK).json({
    status: 'success',
    message: 'Signed out successfully',
  });
};


const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await AuthService.deleteAccount(req.user.id);

    res.cookie('accessToken', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });

    res.status(OK).json({
      status: 'success',
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export {
  signUp,
  signIn,
  signOut,
  deleteAccount,
};
