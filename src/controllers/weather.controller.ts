import { AuthRequest } from '../AuthRequest';
import { Response } from 'express';
import historyModel from '../model/history.model';
import weatherModel from '../model/weather.model';
import GetAPIWeather from '../utils/apiWeather';

export const getWeather = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.userId;

         //  استخراج الإحداثيات من الطلب
    const { lat, lon } = req.query;
    const latNum = parseFloat(lat as string);
    const lonNum = parseFloat(lon as string);
   //  التحقق مما إذا كانت الإحداثيات صحيحة
    if (isNaN(latNum) || isNaN(lonNum)) {
      res.status(400).json({ success: false, error: 'Invalid coordinates' });
      return;
    }
        //  تقريب الإحداثيات لتقليل الطلبات المتكررة لنفس الموقع

    const roundedLat = parseFloat(latNum.toFixed(2));
    const roundedLon = parseFloat(lonNum.toFixed(2));
 //  البحث عن بيانات الطقس في قاعدة البيانات
    let weather = await weatherModel.findOne({ lat: roundedLat, lon: roundedLon });

      //  إن لم تكن موجودة، اجمعها من API ا
    if (!weather) {
      const data = await GetAPIWeather(latNum, lonNum);
      if (!data) {
        res.status(500).json({ success: false, error: 'Failed to fetch weather data' });
        return;
      }
      weather = await weatherModel.create({ lat: roundedLat, lon: roundedLon, data });
    }

    await historyModel.create({
      user: userId,
      weather: weather._id,
      lat: latNum,
      lon: lonNum,
    });

    res.json({ success: true, data: weather.data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Server Error', details: err.message });
  }
};