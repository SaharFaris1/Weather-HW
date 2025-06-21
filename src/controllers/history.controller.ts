import { AuthRequest } from '../AuthRequest';
import { Response } from 'express';
import historyModel from '../model/history.model';

export const getUserHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

 //  ياخذ ID المستخدم من التوكن
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const history = await historyModel
      .find({ user: userId })
      //ربط بيانات الطقس بكل سجل
      .populate('weather') 
      //ترتيب من الأحدث إلى الأقدم
      .sort({ requestedAt: -1 }); 

    res.json({
      success: true,
      data: history
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history',
      details: err.message
    });
  }
};