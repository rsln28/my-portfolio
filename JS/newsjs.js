// newsjs.js - 5 панелей новостей с реальным API

class AdvancedNewsWidget {
    constructor() {
        // API ключ от NewsAPI (БЕСПЛАТНЫЙ - нужно зарегистрироваться)
        this.API_KEY = 'e9ed78d29fd54eeeb7dcb2e0118e15a6'; // ← ЗАМЕНИ НА СВОЙ КЛЮЧ
        
        // Настройки для каждой панели
        this.panels = {
            'news-it': {
                title: 'IT Новости',
                category: 'technology',
                icon: 'fa-laptop-code',
                sources: 'techcrunch,wired' // IT источники
            },
            'news-politics': {
                title: 'Политика',
                category: 'politics', 
                icon: 'fa-landmark',
                sources: 'bbc-news,cnn'
            },
            'news-sports': {
                title: 'Спорт',
                category: 'sports',
                icon: 'fa-running',
                sources: 'espn,bbc-sport'
            },
            'news-health': {
                title: 'Здоровье',
                category: 'health',
                icon: 'fa-heartbeat',
                sources: 'medical-news-today'
            },
            'news-tech': {
                title: 'Технологии',
                category: 'technology',
                icon: 'fa-robot',
                sources: 'ars-technica,engadget'
            }
        };
        
        this.init();
    }

    init() {
        // Загружаем новости для всех панелей
        this.loadAllNews();
        
        // Автообновление каждые 2 часа
        setInterval(() => this.loadAllNews(), 2 * 60 * 60 * 1000);
        
        // Добавляем клики для обновления
        this.addUpdateButtons();
    }

    // Загружаем новости для всех панелей
    async loadAllNews() {
        for (const [panelId, panelConfig] of Object.entries(this.panels)) {
            await this.loadPanelNews(panelId, panelConfig);
            // Небольшая задержка между запросами чтобы не перегружать API
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Загружаем новости для конкретной панели
    async loadPanelNews(panelId, panelConfig) {
        try {
            this.setLoadingState(panelId, true);
            
            // Пробуем получить реальные новости
            const realNews = await this.fetchRealNews(panelConfig);
            const news = realNews || this.getFallbackNews(panelConfig.category);
            
            this.displayNews(panelId, news);
            this.setLoadingState(panelId, false);
            this.updateTimestamp(panelId);
            
        } catch (error) {
            console.log(`Ошибка загрузки новостей для ${panelId}:`, error);
            const fallbackNews = this.getFallbackNews(panelConfig.category);
            this.displayNews(panelId, fallbackNews);
        }
    }

    // Получаем реальные новости через NewsAPI
    async fetchRealNews(panelConfig) {
        // Если API ключ не установлен, возвращаем null
        if (this.API_KEY === 'твой_api_ключ_здесь') {
            return null;
        }

        try {
            // NewsAPI endpoint для топовых новостей по категории
            const url = `https://newsapi.org/v2/top-headlines?category=${panelConfig.category}&language=ru&pageSize=3&apiKey=${this.API_KEY}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.articles && data.articles.length > 0) {
                return data.articles.slice(0, 3).map(article => ({
                    headline: article.title,
                    preview: article.description || 'Описание недоступно',
                    time: this.formatTime(article.publishedAt),
                    url: article.url
                }));
            }
            
            return null;
            
        } catch (error) {
            console.log('NewsAPI error:', error);
            return null;
        }
    }

    // Форматируем время публикации
    formatTime(publishedAt) {
        const now = new Date();
        const articleTime = new Date(publishedAt);
        const diffHours = Math.floor((now - articleTime) / (1000 * 60 * 60));
        
        if (diffHours < 1) return 'Только что';
        if (diffHours < 24) return `${diffHours} ч назад`;
        return `${Math.floor(diffHours / 24)} д назад`;
    }

    // Запасные новости если API не работает
    getFallbackNews(category) {
        const newsTemplates = {
            technology: [
                {
                    headline: "Искусственный интеллект создает код быстрее разработчиков",
                    preview: "Новые модели ИИ показывают впечатляющие результаты в генерации кода",
                    time: "2 ч назад",
                    url: "#"
                },
                {
                    headline: "TypeScript 5.0 выходит с новыми функциями",
                    preview: "Major обновление популярного языка программирования",
                    time: "5 ч назад", 
                    url: "#"
                },
                {
                    headline: "Кибербезопасность: новые вызовы 2024",
                    preview: "Эксперты обсуждают современные угрозы для веб-приложений",
                    time: "1 д назад",
                    url: "#"
                }
            ],
            politics: [
                {
                    headline: "Международные встречи на высшем уровне",
                    preview: "Обсуждение глобальных экономических вопросов",
                    time: "3 ч назад",
                    url: "#"
                },
                {
                    headline: "Новые законодательные инициативы",
                    preview: "Парламент рассматривает важные законопроекты",
                    time: "6 ч назад",
                    url: "#"
                },
                {
                    headline: "Экономическое развитие регионов",
                    preview: "Программы поддержки малого бизнеса",
                    time: "1 д назад",
                    url: "#"
                }
            ],
            sports: [
                {
                    headline: "Футбольный матч чемпионата завершился победой",
                    preview: "Зрелищная игра с большим количеством голов",
                    time: "1 ч назад",
                    url: "#"
                },
                {
                    headline: "Подготовка к Олимпийским играм",
                    preview: "Сборные страны усиленно тренируются",
                    time: "4 ч назад",
                    url: "#"
                },
                {
                    headline: "Новые рекорды в легкой атлетике",
                    preview: "Спортсмены показывают выдающиеся результаты",
                    time: "1 д назад",
                    url: "#"
                }
            ],
            health: [
                {
                    headline: "Новое исследование о здоровом питании",
                    preview: "Ученые раскрывают секреты долголетия",
                    time: "2 ч назад",
                    url: "#"
                },
                {
                    headline: "Прорыв в медицинских технологиях",
                    preview: "Инновационные методы диагностики заболеваний",
                    time: "5 ч назад",
                    url: "#"
                },
                {
                    headline: "Советы по ментальному здоровью",
                    preview: "Эксперты рекомендуют методы борьбы со стрессом",
                    time: "1 д назад",
                    url: "#"
                }
            ]
        };
        
        return newsTemplates[category] || newsTemplates.technology;
    }

    // Показываем новости в панели
    displayNews(panelId, news) {
        const newsList = document.querySelector(`.${panelId} .news-list`);
        if (!newsList) return;
        
        newsList.innerHTML = '';
        
        news.forEach(item => {
            const newsElement = this.createNewsElement(item);
            newsList.appendChild(newsElement);
        });
    }

    // Создаем элемент новости
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
            if (newsItem.url && newsItem.url !== '#') {
                window.open(newsItem.url, '_blank');
            } else {
                this.showNewsDetail(newsItem);
            }
        });
        
        return article;
    }

    // Детальная информация
    showNewsDetail(newsItem) {
        alert(`📰 ${newsItem.headline}\n\n${newsItem.preview}\n\nВремя: ${newsItem.time}`);
    }

    // Статус загрузки
    setLoadingState(panelId, loading) {
        const updateIcon = document.querySelector(`.${panelId} .news-update-icon`);
        if (updateIcon) {
            if (loading) {
                updateIcon.classList.add('fa-spin');
            } else {
                updateIcon.classList.remove('fa-spin');
            }
        }
    }

    // Время обновления
    updateTimestamp(panelId) {
        const updateText = document.querySelector(`.${panelId} .news-update-text`);
        if (updateText) {
            const now = new Date();
            updateText.textContent = 
                `Обновлено ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        }
    }

    // Кнопки обновления
    addUpdateButtons() {
        Object.keys(this.panels).forEach(panelId => {
            const updateIcon = document.querySelector(`.${panelId} .news-update-icon`);
            if (updateIcon) {
                updateIcon.style.cursor = 'pointer';
                updateIcon.title = 'Обновить новости';
                updateIcon.addEventListener('click', () => {
                    this.loadPanelNews(panelId, this.panels[panelId]);
                });
            }
        });
    }
}

// Запускаем когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    console.log('📰 Запускаем расширенный виджет новостей...');
    new AdvancedNewsWidget();
});