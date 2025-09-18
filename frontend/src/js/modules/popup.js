export default function initToggleModal() {
  const body = document.body;
  let scrollPosition = 0;

  document.addEventListener("click", (e) => {
    const button = e.target.closest("[data-toggle-modal]");
    if (!button) return;

    e.preventDefault();
    const modalId = button.getAttribute("data-toggle-modal");
    const modal = document.getElementById(modalId);

    if (!modal) {
      console.warn(`Модальное окно с ID "${modalId}" не найдено.`);
      return;
    }

    const isModalVisible = window.getComputedStyle(modal).display !== "none";

    if (isModalVisible) {
      closeModal(modal);
    } else {
      openModal(modal);
    }
  });

  // Закрытие по клику на фон
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal(e.target);
    }
  });

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModals = document.querySelectorAll(
        '.modal[style*="display: block"]'
      );
      if (openModals.length > 0) {
        closeModal(openModals[0]);
      }
    }
  });

  // Обработчик отправки формы
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (form.classList.contains("contact-form")) {
      e.preventDefault();
      submitContactForm(form);
    }
  });

  function openModal(modal) {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    modal.style.display = "flex";
    body.classList.add("modal-open");
    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.width = "100%";
  }

  function closeModal(modal) {
    modal.style.display = "none";
    body.classList.remove("modal-open");
    body.style.position = "";
    body.style.top = "";
    body.style.width = "";
    window.scrollTo(0, scrollPosition);

    const forms = modal.querySelectorAll("form");
    forms.forEach((form) => form.reset());
  }

  function showSuccessModal() {
    const successModal = document.getElementById("success-modal");
    if (successModal) {
      openModal(successModal);

      setTimeout(() => {
        closeModal(successModal);
      }, 4000);
    }
  }

  function showErrorModal(message) {
    const errorModal = document.getElementById("error-modal");
    if (errorModal) {
      const errorMessage = errorModal.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.textContent =
          message || "Произошла ошибка при отправке. Попробуйте еще раз.";
      }
      openModal(errorModal);
    } else {
      alert(message || "Произошла ошибка при отправке.");
    }
  }

  async function submitContactForm(form) {
    const submitBtn = form.querySelector(".btn-submit");
    const originalText = submitBtn.textContent;
    const originalHtml = submitBtn.innerHTML;

    // Блокируем кнопку и показываем загрузку
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
            <span class="loading-spinner"></span>
            Отправка...
        `;

    try {
      // Собираем данные формы
      const formData = new FormData(form);
      const data = {
        name: formData.get("name"),
        contact: formData.get("contact"),
        idea: formData.get("idea"),
        // Дополнительная информация
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        pageUrl: window.location.href,
        referrer: document.referrer,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      };

      // Отправляем на сервер
      const response = await fetch("http://127.0.0.1:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Ошибка сервера: ${response.status}`);
      }

      // Успешная отправка
      const formModal = form.closest(".modal");
      if (formModal) {
        closeModal(formModal);
      }

      form.reset();
      showSuccessModal();
    } catch (error) {
      console.error("Ошибка отправки формы:", error);
      showErrorModal(error.message);
    } finally {
      // Восстанавливаем кнопку
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.innerHTML = originalHtml;
    }
  }
}
