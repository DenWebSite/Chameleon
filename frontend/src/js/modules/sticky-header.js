// function headerShadow() {
//     const header = document.querySelector('.header');
//     const shadowScrollHeight = 1;

//     function updateHeaderShadow() {
//         if (window.scrollY > shadowScrollHeight) {
//             // header.classList.add('header--scrolled');
//             header.classList.add('sticky');
//         } else {
//             // header.classList.remove('header--scrolled');
//             header.classList.remove('sticky');
//         }
//     }

//     // Инициализация
//     updateHeaderShadow();

//     // Оптимизированный обработчик скролла
//     let ticking = false;
//     window.addEventListener('scroll', function () {
//         if (!ticking) {
//             window.requestAnimationFrame(function () {
//                 updateHeaderShadow();
//                 ticking = false;
//             });
//             ticking = true;
//         }
//     });
// }

// export default headerShadow;