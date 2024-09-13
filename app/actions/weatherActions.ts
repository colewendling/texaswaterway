'use server';

export async function getWeather(lat: number, lon: number) {
  const apiKey = process.env.OPENWEATHER_API_KEY; // Ensure API key is set
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather data.');

    const data = await response.json();

    // Process the next 5 forecasts (3-hour intervals)
    const forecast = data.list.slice(0, 5).map((item: any) => ({
      time: new Date(item.dt_txt).toLocaleTimeString([], {
        hour: 'numeric',
        hour12: true,
      }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
    }));

    const currentTemp = Math.round(data.list[0].main.temp);
    const high = Math.round(
      Math.max(...data.list.map((item: any) => item.main.temp_max)),
    );
    const low = Math.round(
      Math.min(...data.list.map((item: any) => item.main.temp_min)),
    );

    return { currentTemp, high, low, forecast };
  } catch (error) {
    console.error('Weather API Error:', error);
    return null;
  }
}
