let swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    loop: true,
    keyboard: true,

    // Навигация — пока отключена, будет управляться вручную
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    // Пагинация — будет управляться вручную
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        type: "bullets",
    },
});

function updateSwiperControls() {
    const isLargeScreen = window.innerWidth > 1400;
    const isSmallScreen = window.innerWidth < 1400;

    const nextEl = document.querySelector(".swiper-button-next");
    const prevEl = document.querySelector(".swiper-button-prev");
    const paginationEl = document.querySelector(".swiper-pagination");

    // --- Стрелки ---
    if (isLargeScreen) {
        swiper.params.navigation.enabled = true;
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
        nextEl.style.display = "flex";
        prevEl.style.display = "flex";
    } else {
        swiper.params.navigation.enabled = false;
        swiper.navigation.destroy();
        nextEl.style.display = "none";
        prevEl.style.display = "none";
    }

    // --- Пагинация ---
    if (isSmallScreen) {
        swiper.params.pagination.enabled = true;
        swiper.pagination.destroy();
        swiper.pagination.init();
        swiper.pagination.render();
        swiper.pagination.update();
        paginationEl.style.display = "flex";
    } else {
        swiper.params.pagination.enabled = false;
        swiper.pagination.destroy();
        paginationEl.style.display = "none";
    }
}

// Вызов при загрузке и ресайзе
document.addEventListener("DOMContentLoaded", updateSwiperControls);
window.addEventListener("resize", updateSwiperControls);

export default swiper;