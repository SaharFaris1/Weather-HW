import axios from 'axios';

const GetAPIWeather = async (lat: number, lon: number): Promise<any> => {
const apiKey = "130e55ebc8f4e1ce213618eded89677a"


  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Failed to get weather data: ${error.message}`,
    };
  }
};

export default GetAPIWeather;