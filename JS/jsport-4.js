// jsport-4.js - умный виджет погоды для Калининграда

class WeatherWidget {
    constructor() {
        // ТВОЙ КЛЮЧ ОТ OPENWEATHERMAP
        this.API_KEY = '906508d0c3d23a96be19bbeb9c7c1462';
        
        // Находим элементы на странице
        this.weatherElements = {
            temperature: document.querySelector('.temperature'),
            description: document.querySelector('.weather-description'),
            wind: document.querySelector('.weather-item:nth-child(1) .weather-value'),
            humidity: document.querySelector('.weather-item:nth-child(2) .weather-value'),
            feelsLike: document.querySelector('.weather-item:nth-child(3) .weather-value'),
            updateTime: document.querySelector('.update-text')
        };
        
        // Запускаем погоду
        this.init();
    }

    // Главная функция запуска
    init() {
        this.updateWeather(); // Первая загрузка
        
        // Обновляем каждые 30 минут
        setInterval(() => this.updateWeather(), 30 * 60 * 1000);
        
        // Клик для обновления
        this.addUpdateOnClick();
    }

    // Получаем настоящую погоду из Калининграда!
    async fetchRealWeatherData() {
        try {
            console.log('Запрашиваем погоду у OpenWeatherMap...');
            
            // Делаем запрос к OpenWeatherMap
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=Kaliningrad,RU&units=metric&appid=${this.API_KEY}&lang=ru`
            );
            
            console.log('Ответ получен:', response.status);
            
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Данные погоды:', data);
            
            // Превращаем данные OpenWeatherMap в наши
            return {
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                wind: data.wind.speed,
                humidity: data.main.humidity,
                feelsLike: Math.round(data.main.feels_like)
            };
            
        } catch (error) {
            console.log('Ошибка получения погоды:', error);
            // Если не получилось, покажем тестовые данные
            return this.getFallbackData();
        }
    }

    // Запасные данные если OpenWeatherMap не работает
    getFallbackData() {
        return {
            temperature: 7,
            description: 'Облачно',
            wind: 3.2,
            humidity: 75,
            feelsLike: 5
        };
    }

    // Обновляем погоду на странице
    async updateWeather() {
        try {
            this.setLoadingState(true);
            
            // Получаем настоящие данные!
            const weatherData = await this.fetchRealWeatherData();
            
            this.updateUI(weatherData);
            this.setLoadingState(false);
            
        } catch (error) {
            console.error('Ошибка:', error);
            this.setErrorState();
        }
    }

    // Показываем погоду на странице
    updateUI(data) {
        // Температура
        this.weatherElements.temperature.textContent = 
            `${data.temperature > 0 ? '+' : ''}${data.temperature}°C`;
        
        // Описание (делаем первую букву заглавной)
        this.weatherElements.description.textContent = 
            data.description.charAt(0).toUpperCase() + data.description.slice(1);
        
        // Ветер
        this.weatherElements.wind.textContent = `${data.wind} м/с`;
        
        // Влажность
        this.weatherElements.humidity.textContent = `${data.humidity}%`;
        
        // Ощущается как
        this.weatherElements.feelsLike.textContent = 
            `${data.feelsLike > 0 ? '+' : ''}${data.feelsLike}°C`;
        
        // Время обновления
        const now = new Date();
        this.weatherElements.updateTime.textContent = 
            `Обновлено ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    // Кружочек загрузки
    setLoadingState(loading) {
        const updateIcon = document.querySelector('.update-icon');
        if (loading) {
            updateIcon.classList.add('fa-spin');
        } else {
            updateIcon.classList.remove('fa-spin');
        }
    }

    // Если ошибка
    setErrorState() {
        this.weatherElements.temperature.textContent = '--°C';
        this.weatherElements.description.textContent = 'Нет данных';
        this.weatherElements.updateTime.textContent = 'Ошибка загрузки';
    }

    // Клик для обновления
    addUpdateOnClick() {
        const updateIcon = document.querySelector('.update-icon');
        updateIcon.style.cursor = 'pointer';
        updateIcon.title = 'Обновить погоду';
        updateIcon.addEventListener('click', () => this.updateWeather());
    }
}

// Ждем когда страница загрузится и запускаем погоду
document.addEventListener('DOMContentLoaded', () => {
    console.log('Запускаем виджет погоды...');
    new WeatherWidget();
});