// currency.js - скрипт для получения курсов валют
class CurrencyPanel {
    constructor() {
        this.currencies = [
            { code: 'USD', name: 'USD/RUB' },
            { code: 'EUR', name: 'EUR/RUB' },
            { code: 'CNY', name: 'CNY/RUB' }
        ];
        this.cacheDuration = 10 * 60 * 1000; // 10 минут кэш
        this.init();
    }

    async init() {
        await this.loadCurrencies();
        // Обновляем каждые 10 минут
        setInterval(() => this.loadCurrencies(), this.cacheDuration);
    }

    async loadCurrencies() {
        try {
            const rates = await this.getExchangeRates();
            this.updateUI(rates);
            this.updateTimestamp();
        } catch (error) {
            console.error('Ошибка загрузки курсов:', error);
            this.showError();
        }
    }

    async getExchangeRates() {
        // Пробуем несколько источников API
        const sources = [
            this.fetchFromCBR(),
            this.fetchFromExchangeRateAPI()
        ];

        for (const source of sources) {
            try {
                const rates = await source;
                if (rates && Object.keys(rates).length > 0) {
                    return rates;
                }
            } catch (error) {
                console.warn('Источник не доступен:', error);
            }
        }
        
        throw new Error('Все источники недоступны');
    }

    async fetchFromCBR() {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const data = await response.json();
        
        return {
            USD: data.Valute.USD.Value,
            EUR: data.Valute.EUR.Value,
            CNY: data.Valute.CNY.Value
        };
    }

    async fetchFromExchangeRateAPI() {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
        const data = await response.json();
        
        return {
            USD: 1 / data.rates.USD,
            EUR: 1 / data.rates.EUR,
            CNY: 1 / data.rates.CNY
        };
    }

    updateUI(rates) {
        this.currencies.forEach(currency => {
            const rate = rates[currency.code];
            if (rate) {
                this.updateCurrencyItem(currency.name, rate);
            }
        });
    }

    updateCurrencyItem(currencyName, rate) {
        const items = document.querySelectorAll('.currency-item');
        items.forEach(item => {
            const nameElement = item.querySelector('.currency-name');
            if (nameElement.textContent === currencyName) {
                const valueElement = item.querySelector('.currency-value');
                const changeElement = item.querySelector('.currency-change');
                
                const formattedRate = rate.toFixed(2);
                valueElement.textContent = formattedRate;
                
                // Имитация изменения курса (в реальном приложении нужно хранить предыдущие значения)
                const randomChange = (Math.random() - 0.5) * 2;
                changeElement.textContent = randomChange.toFixed(2);
                changeElement.className = 'currency-change ' + 
                    (randomChange > 0 ? 'positive' : randomChange < 0 ? 'negative' : 'neutral');
            }
        });
    }

    updateTimestamp() {
        const updateElement = document.querySelector('.currency-update .update-text');
        if (updateElement) {
            const now = new Date();
            updateElement.textContent = `Обновлено: ${now.toLocaleTimeString()}`;
        }
    }

    showError() {
        const items = document.querySelectorAll('.currency-value');
        items.forEach(item => {
            item.textContent = 'Ошибка';
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyPanel();
});