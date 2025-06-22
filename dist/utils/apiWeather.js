"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const GetAPIWeather = async (lat, lon) => {
    const apiKey = "130e55ebc8f4e1ce213618eded89677a";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await axios_1.default.get(url);
        return {
            success: true,
            data: response.data,
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Failed to get weather data: ${error.message}`,
        };
    }
};
exports.default = GetAPIWeather;
