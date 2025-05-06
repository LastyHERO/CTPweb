document.addEventListener('DOMContentLoaded', function() {
    const targets = document.querySelectorAll('.target');
    let draggedElement = null;
    let isDoubleClickDrag = false;
    let isTouchDrag = false;
    let initialX, initialY;
    let initialLeft, initialTop;
    let touchCount = 0;
    let resizeHandle = null;
    const minSize = 30; // Минимальный размер элемента

    // Создаем элементы для изменения размера
    function createResizeHandle(target) {
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        handle.style.width = '10px';
        handle.style.height = '10px';
        handle.style.backgroundColor = 'green';
        handle.style.position = 'absolute';
        handle.style.right = '0';
        handle.style.bottom = '0';
        handle.style.cursor = 'se-resize';
        target.appendChild(handle);
        
        handle.addEventListener('mousedown', initResize);
        handle.addEventListener('touchstart', initResizeTouch, { passive: false });
    }

    // Инициализация изменения размера (мышь)
    function initResize(e) {
        e.stopPropagation();
        resizeHandle = e.target;
        draggedElement = resizeHandle.parentElement;
        initialX = e.clientX;
        initialY = e.clientY;
        initialLeft = parseInt(draggedElement.style.width) || draggedElement.offsetWidth;
        initialTop = parseInt(draggedElement.style.height) || draggedElement.offsetHeight;
        
        document.addEventListener('mousemove', resizeElement);
        document.addEventListener('mouseup', stopResize);
    }

    // Инициализация изменения размера (тач)
    function initResizeTouch(e) {
        e.preventDefault();
        e.stopPropagation();
        resizeHandle = e.target;
        draggedElement = resizeHandle.parentElement;
        const touch = e.touches[0];
        initialX = touch.clientX;
        initialY = touch.clientY;
        initialLeft = parseInt(draggedElement.style.width) || draggedElement.offsetWidth;
        initialTop = parseInt(draggedElement.style.height) || draggedElement.offsetHeight;
        
        document.addEventListener('touchmove', resizeElementTouch, { passive: false });
        document.addEventListener('touchend', stopResize);
    }

    // Изменение размера элемента (мышь)
    function resizeElement(e) {
        const dx = e.clientX - initialX;
        const dy = e.clientY - initialY;
        const newWidth = Math.max(minSize, initialLeft + dx);
        const newHeight = Math.max(minSize, initialTop + dy);
        
        draggedElement.style.width = newWidth + 'px';
        draggedElement.style.height = newHeight + 'px';
    }

    // Изменение размера элемента (тач)
    function resizeElementTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - initialX;
        const dy = touch.clientY - initialY;
        const newWidth = Math.max(minSize, initialLeft + dx);
        const newHeight = Math.max(minSize, initialTop + dy);
        
        draggedElement.style.width = newWidth + 'px';
        draggedElement.style.height = newHeight + 'px';
    }

    // Остановка изменения размера
    function stopResize() {
        document.removeEventListener('mousemove', resizeElement);
        document.removeEventListener('touchmove', resizeElementTouch);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchend', stopResize);
        resizeHandle = null;
        draggedElement = null;
    }

    // Добавляем обработчики для каждого элемента
    targets.forEach(target => {
        target.dataset.initialLeft = target.style.left;
        target.dataset.initialTop = target.style.top;
        
        // Создаем элемент для изменения размера
        createResizeHandle(target);

        // Обработчики мыши
        target.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('resize-handle')) return;
            if (e.detail > 1) return;
            
            draggedElement = target;
            isDoubleClickDrag = false;
            isTouchDrag = false;
            
            initialX = e.clientX;
            initialY = e.clientY;
            initialLeft = parseInt(target.style.left) || 0;
            initialTop = parseInt(target.style.top) || 0;
            
            target.classList.add('dragging');
            e.preventDefault();
        });
        
        target.addEventListener('dblclick', function(e) {
            if (e.target.classList.contains('resize-handle')) return;
            
            draggedElement = target;
            isDoubleClickDrag = true;
            isTouchDrag = false;
            
            initialLeft = parseInt(target.style.left) || 0;
            initialTop = parseInt(target.style.top) || 0;
            
            target.style.backgroundColor = 'blue';
            target.classList.add('double-drag');
            e.preventDefault();
        });

        // Обработчики касаний
        target.addEventListener('touchstart', function(e) {
            if (e.target.classList.contains('resize-handle')) return;
            
            if (e.touches.length > 1) {
                // Мультитач - отмена перетаскивания
                if (draggedElement) {
                    resetElementPosition(draggedElement);
                    draggedElement = null;
                    isDoubleClickDrag = false;
                    isTouchDrag = false;
                }
                return;
            }
            
            touchCount++;
            
            if (touchCount === 2 && !isTouchDrag) {
                // Двойное касание - активация режима следования
                draggedElement = target;
                isTouchDrag = true;
                isDoubleClickDrag = false;
                
                initialLeft = parseInt(target.style.left) || 0;
                initialTop = parseInt(target.style.top) || 0;
                
                target.style.backgroundColor = 'green';
                target.classList.add('touch-drag');
                e.preventDefault();
                return;
            }
            
            if (!isTouchDrag) {
                // Обычное перетаскивание
                draggedElement = target;
                isTouchDrag = false;
                isDoubleClickDrag = false;
                
                const touch = e.touches[0];
                initialX = touch.clientX;
                initialY = touch.clientY;
                initialLeft = parseInt(target.style.left) || 0;
                initialTop = parseInt(target.style.top) || 0;
                
                target.classList.add('dragging');
                e.preventDefault();
            }
        }, { passive: false });
    });

    // Сброс позиции элемента
    function resetElementPosition(element) {
        element.style.left = element.dataset.initialLeft;
        element.style.top = element.dataset.initialTop;
        element.style.backgroundColor = 'red';
        element.classList.remove('dragging', 'double-drag', 'touch-drag');
    }

    // Обработчик движения мыши
    document.addEventListener('mousemove', function(e) {
        if (!draggedElement || resizeHandle) return;
        
        if (isDoubleClickDrag) {
            draggedElement.style.left = (e.clientX - draggedElement.offsetWidth / 2) + 'px';
            draggedElement.style.top = (e.clientY - draggedElement.offsetHeight / 2) + 'px';
        } else if (!isTouchDrag) {
            const dx = e.clientX - initialX;
            const dy = e.clientY - initialY;
            draggedElement.style.left = (initialLeft + dx) + 'px';
            draggedElement.style.top = (initialTop + dy) + 'px';
        }
    });

    // Обработчик движения касания
    document.addEventListener('touchmove', function(e) {
        if (!draggedElement || resizeHandle || e.touches.length > 1) return;
        
        const touch = e.touches[0];
        
        if (isTouchDrag) {
            draggedElement.style.left = (touch.clientX - draggedElement.offsetWidth / 2) + 'px';
            draggedElement.style.top = (touch.clientY - draggedElement.offsetHeight / 2) + 'px';
        } else {
            const dx = touch.clientX - initialX;
            const dy = touch.clientY - initialY;
            draggedElement.style.left = (initialLeft + dx) + 'px';
            draggedElement.style.top = (initialTop + dy) + 'px';
        }
        
        e.preventDefault();
    }, { passive: false });

    // Обработчик окончания касания
    document.addEventListener('touchend', function(e) {
        if (isTouchDrag) {
            // Проверяем, был ли это быстрый тап (для выхода из режима следования)
            if (e.changedTouches[0].touchType === 'direct' && 
                Date.now() - touchStartTime < 300) {
                resetElementPosition(draggedElement);
                draggedElement = null;
                isTouchDrag = false;
            }
        } else if (draggedElement && !isDoubleClickDrag) {
            draggedElement.classList.remove('dragging');
            draggedElement = null;
        }
        
        touchCount = 0;
    });

    let touchStartTime = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
        
        // Если мультитач во время перетаскивания - отмена
        if (e.touches.length > 1 && draggedElement) {
            resetElementPosition(draggedElement);
            draggedElement = null;
            isDoubleClickDrag = false;
            isTouchDrag = false;
        }
    }, { passive: false });

    // Обработчик клика (для открепления после двойного клика)
    document.addEventListener('click', function(e) {
        if (draggedElement && (isDoubleClickDrag || isTouchDrag) && 
            !e.target.classList.contains('resize-handle') && 
            e.target !== draggedElement) {
            resetElementPosition(draggedElement);
            draggedElement = null;
            isDoubleClickDrag = false;
            isTouchDrag = false;
        }
    });

    // Обработчик клавиши Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && draggedElement) {
            resetElementPosition(draggedElement);
            draggedElement = null;
            isDoubleClickDrag = false;
            isTouchDrag = false;
        }
    });
});