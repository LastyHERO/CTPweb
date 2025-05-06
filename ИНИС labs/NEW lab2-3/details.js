document.addEventListener('DOMContentLoaded', function() {
    const productName = document.getElementById('product-name');
    const productFront = document.getElementById('product-front');
    const productBack = document.getElementById('product-back');
    const productDescription = document.getElementById('product-description');
    const productPrice = document.getElementById('product-price');
    const colorOptions = document.getElementById('color-options');
    const backButton = document.getElementById('back-button');

    // Получаем данные из localStorage
    const selectedShirtName = localStorage.getItem('selectedShirt');
    
    if (!selectedShirtName) {
        window.location.href = 'index.html';
        return;
    }

    // Находим выбранную футболку в массиве
    const selectedShirt = shirts.find(shirt => shirt.name === selectedShirtName);
    
    if (!selectedShirt) {
        window.location.href = 'index.html';
        return;
    }

    // Заполняем данные о продукте
    productName.textContent = selectedShirt.name;
    productDescription.textContent = selectedShirt.description;
    productPrice.textContent = selectedShirt.price;

    // Показываем первый доступный цвет по умолчанию
    const firstColor = Object.keys(selectedShirt.colors)[0];
    if (firstColor) {
        productFront.src = selectedShirt.colors[firstColor].front;
        productBack.src = selectedShirt.colors[firstColor].back;
    }

    // Создаем кнопки выбора цвета
    colorOptions.innerHTML = '';
    Object.keys(selectedShirt.colors).forEach(color => {
        const colorBtn = document.createElement('button');
        colorBtn.className = 'color-btn';
        colorBtn.style.backgroundColor = color;
        colorBtn.title = color;
        colorBtn.addEventListener('click', () => {
            productFront.src = selectedShirt.colors[color].front;
            productBack.src = selectedShirt.colors[color].back;
        });
        colorOptions.appendChild(colorBtn);
    });

    // Обработчик ошибок изображений
    productFront.onerror = function() {
        this.src = selectedShirt.default.front;
    };
    productBack.onerror = function() {
        this.src = selectedShirt.default.back;
    };

    // Кнопка "Назад"
    backButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});