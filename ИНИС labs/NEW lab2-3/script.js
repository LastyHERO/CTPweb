document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('products-container');
    const quickView = document.getElementById('quick-view');
    
    // Обработка ошибок при загрузке изображений
    function handleImageError(imgElement, defaultImage) {
        imgElement.onerror = null;
        imgElement.src = defaultImage;
    }
    
    // Создание элемента продукта
    function createProductElement(shirt) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        
        const nameElement = document.createElement('h2');
        nameElement.textContent = shirt.name;
        
        const colorCount = Object.keys(shirt.colors).length;
        const colorsElement = document.createElement('p');
        colorsElement.textContent = `Доступно в ${colorCount} цвет${getRussianPluralEnding(colorCount)}`;
        
        // Кнопка быстрого просмотра
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.textContent = 'Быстрый просмотр';
        quickViewBtn.addEventListener('click', () => showQuickView(shirt));
        
        // Кнопка детальной страницы
        const seePageBtn = document.createElement('button');
        seePageBtn.className = 'see-page-btn';
        seePageBtn.textContent = 'Подробнее';
        seePageBtn.addEventListener('click', function() {
            // Сохраняем выбранную футболку в localStorage
            localStorage.setItem('selectedShirt', shirt.name);
            // Переходим на страницу с деталями
            window.location.href = 'details.html';
        });
        
        productDiv.appendChild(nameElement);
        productDiv.appendChild(colorsElement);
        productDiv.appendChild(quickViewBtn);
        productDiv.appendChild(seePageBtn);
        
        return productDiv;
    }

    // Функция для правильного склонения слова "цвет"
    function getRussianPluralEnding(number) {
        if (number % 10 === 1 && number % 100 !== 11) {
            return 'е';
        } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
            return 'ах';
        }
        return 'ах';
    }
    
    // Показать быстрый просмотр
    function showQuickView(shirt) {
        const quickViewTitle = document.getElementById('quick-view-title');
        const quickViewImages = document.getElementById('quick-view-images');
        const quickViewDescription = document.getElementById('quick-view-description');
        const quickViewPrice = document.getElementById('quick-view-price');
        
        quickViewTitle.textContent = shirt.name;
        quickViewDescription.textContent = shirt.description;
        quickViewPrice.textContent = shirt.price;
        
        // Очищаем предыдущие изображения
        quickViewImages.innerHTML = '';
        
        // Добавляем первое доступное изображение
        const firstColor = Object.keys(shirt.colors)[0];
        if (firstColor) {
            const frontImg = document.createElement('img');
            frontImg.src = shirt.colors[firstColor].front;
            frontImg.alt = `Вид спереди: ${shirt.name}`;
            frontImg.style.maxWidth = '100%';
            frontImg.onerror = function() {
                handleImageError(this, shirt.default.front);
            };
            quickViewImages.appendChild(frontImg);
            
            const backImg = document.createElement('img');
            backImg.src = shirt.colors[firstColor].back;
            backImg.alt = `Вид сзади: ${shirt.name}`;
            backImg.style.maxWidth = '100%';
            backImg.onerror = function() {
                handleImageError(this, shirt.default.back);
            };
            quickViewImages.appendChild(backImg);
        }
        
        // Показываем окно быстрого просмотра
        quickView.classList.remove('hidden');
        
        // Закрытие окна
        const closeBtn = document.querySelector('.close-btn');
        closeBtn.onclick = function() {
            quickView.classList.add('hidden');
        };
        
        // Закрытие при клике вне области
        quickView.onclick = function(e) {
            if (e.target === quickView) {
                quickView.classList.add('hidden');
            }
        };
    }
    
    // Генерация всех продуктов
    function generateProducts() {
        try {
            if (!shirts || !Array.isArray(shirts)) {
                throw new Error('Данные о футболках недоступны или имеют неверный формат');
            }
            
            shirts.forEach(shirt => {
                if (!shirt.name) {
                    console.warn('Найдена футболка без названия, пропускаем');
                    return;
                }
                
                const productElement = createProductElement(shirt);
                productsContainer.appendChild(productElement);
            });
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            productsContainer.innerHTML = '<p>Ошибка загрузки товаров. Пожалуйста, попробуйте позже.</p>';
        }
    }
    
    // Инициализация
    generateProducts();
});