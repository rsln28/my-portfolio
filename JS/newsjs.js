// newsjs.js - автоматические новости для IT-разработчика

class NewsWidget {
    constructor() {
        this.newsElements = {
            list: document.querySelector('.news-list'),
            updateText: document.querySelector('.news-update-text'),
            updateIcon: document.querySelector('.news-update-icon')
        };
        
        this.init();
    }

    init() {
        this.loadNews(); // Первая загрузка
        
        // Автообновление каждые 2 часа
        setInterval(() => this.loadNews(), 2 * 60 * 60 * 1000);
        
        // Клик для обновления
        this.addUpdateOnClick();
        
        // Показываем разные новости каждые 30 секунд (для демо)
        setInterval(() => this.rotateNews(), 30000);
    }

    // Умная генерация правдоподобных IT-новостей
    generateITNews() {
        const topics = [
            {
                headline: "В Калининграде открылся новый IT-парк",
                preview: "Современный центр для разработчиков и стартапов с коворкингом на 200 мест",
                time: this.getRandomTime()
            },
            {
                headline: "JavaScript стал самым популярным языком",
                preview: "Согласно исследованию Stack Overflow 2024, JS лидирует 9-й год подряд",
                time: this.getRandomTime()
            },
            {
                headline: "Российские разработчики создали новый фреймворк",
                preview: "Инновационное решение для веб-разработки уже тестируется в крупных компаниях",
                time: this.getRandomTime()
            },
            {
                headline: "Веб-разработчики Калининграда объединяются",
                preview: "Создано сообщество для обмена опытом и совместных проектов",
                time: this.getRandomTime()
            },
            {
                headline: "TypeScript обогнал JavaScript в рейтинге",
                preview: "Разработчики предпочитают типизированные языки для больших проектов",
                time: this.getRandomTime()
            },
            {
                headline: "Новые технологии в веб-разработке 2024",
                preview: "Обзор самых перспективных инструментов и фреймворков этого года",
                time: this.getRandomTime()
            }
        ];
        
        // Возвращаем случайные 3 новости
        return this.shuffleArray(topics).slice(0, 3);
    }

    // Случайное время для новости
    getRandomTime() {
        const times = [
            "Только что", "5 мин", "15 мин", "30 мин", "1 ч", 
            "2 ч", "4 ч", "Сегодня", "Вчера"
        ];
        return times[Math.floor(Math.random() * times.length)];
    }

    // Перемешиваем массив
    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Загружаем новости
    async loadNews() {
        try {
            this.setLoadingState(true);
            
            // Используем сгенерированные новости
            const news = this.generateITNews();
            
            this.displayNews(news);
            this.setLoadingState(false);
            this.updateTimestamp();
            
        } catch (error) {
            console.log('Ошибка загрузки новостей:', error);
            const fallbackNews = this.generateITNews();
            this.displayNews(fallbackNews);
        }
    }

    // Показываем новости на странице
    displayNews(news) {
        this.newsElements.list.innerHTML = '';
        
        news.forEach(item => {
            const newsElement = this.createNewsElement(item);
            this.newsElements.list.appendChild(newsElement);
        });
    }

    // Создаем HTML элемент новости
    createNewsElement(newsItem) {
        const article = document.createElement('article');
        article.className = 'news-item';
        article.innerHTML = `
            <div class="news-time">${newsItem.time}</div>
            <h4 class="news-headline">${newsItem.headline}</h4>
            <p class="news-preview">${newsItem.preview}</p>
        `;
        
        // Клик по новости
        article.addEventListener('click', () => {
            this.showNewsDetail(newsItem);
        });
        
        return article;
    }

    // Детальная информация новости
    showNewsDetail(newsItem) {
        alert(`📰 ${newsItem.headline}\n\n${newsItem.preview}\n\nВремя: ${newsItem.time}`);
    }

    // Смена новостей (для демонстрации)
    rotateNews() {
        const newNews = this.generateITNews();
        this.displayNews(newNews);
    }

    // Статус загрузки
    setLoadingState(loading) {
        if (loading) {
            this.newsElements.updateIcon.classList.add('fa-spin');
        } else {
            this.newsElements.updateIcon.classList.remove('fa-spin');
        }
    }

    // Время обновления
    updateTimestamp() {
        const now = new Date();
        this.newsElements.updateText.textContent = 
            `Обновлено ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    // Клик для обновления
    addUpdateOnClick() {
        this.newsElements.updateIcon.style.cursor = 'pointer';
        this.newsElements.updateIcon.title = 'Обновить новости';
        this.newsElements.updateIcon.addEventListener('click', () => this.loadNews());
    }
}

// Запускаем когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    console.log('📰 Запускаем виджет новостей...');
    new NewsWidget();
});