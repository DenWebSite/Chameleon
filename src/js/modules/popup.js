export default function initToggleModal() {
    const body = document.body;
    let scrollPosition = 0;

    document.addEventListener('click', (e) => {
        const button = e.target.closest('[data-toggle-modal]');
        if (!button) return;

        e.preventDefault();
        const modalId = button.getAttribute('data-toggle-modal');
        const modal = document.getElementById(modalId);

        if (!modal) {
            console.warn(`Модальное окно с ID "${modalId}" не найдено.`);
            return;
        }

        const isModalVisible = window.getComputedStyle(modal).display !== 'none';

        if (isModalVisible) {
            closeModal(modal);
        } else {
            openModal(modal);
        }
    });

    // Закрытие по клику на фон
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: block"]');
            if (openModals.length > 0) {
                closeModal(openModals[0]);
            }
        }
    });

    // Обработчик отправки формы
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form.classList.contains('contact-form')) {
            e.preventDefault();
            simulateFormSubmission(form);
        }
    });

    function openModal(modal) {
        // Сохраняем позицию скролла ДО открытия модального окна
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // Показываем модальное окно
        modal.style.display = 'flex';
        body.classList.add('modal-open');

        // Фиксируем позицию body
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
        body.style.width = '100%';
    }

    function closeModal(modal) {
        // Скрываем модальное окно
        modal.style.display = 'none';
        body.classList.remove('modal-open');

        // Восстанавливаем скролл
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        window.scrollTo(0, scrollPosition);

        // Очищаем форму при закрытии
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
    }

    function showSuccessModal() {
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            openModal(successModal);

            // Автоматическое закрытие через 4 секунды
            setTimeout(() => {
                closeModal(successModal);
            }, 4000);
        }
    }

    function simulateFormSubmission(form) {
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;

        // Показываем загрузку
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        // Симуляция задержки отправки
        setTimeout(() => {
            // Закрываем форму
            const formModal = form.closest('.modal');
            if (formModal) {
                closeModal(formModal);
            }

            // Очищаем форму
            form.reset();

            // Показываем окно успеха
            showSuccessModal();

            // Возвращаем кнопку в исходное состояние
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
}