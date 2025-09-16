function mobileNav() {
	// Mobile nav button
	const navBtn = document.querySelector('.mobile-nav-btn');
	const nav = document.querySelector('.mobile-nav');
	const menuIcon = document.querySelector('.nav-icon');
	const navLinks = document.querySelectorAll('.mobile-nav__list-item a');

	// Функция закрытия меню
	function closeMobileNav() {
		nav.classList.remove('mobile-nav--open');
		menuIcon.classList.remove('nav-icon--active');
		document.body.classList.remove('no-scroll');
	}

	// Открытие/закрытие по кнопке
	navBtn.onclick = function () {
		nav.classList.toggle('mobile-nav--open');
		menuIcon.classList.toggle('nav-icon--active');
		document.body.classList.toggle('no-scroll');
	};

	// Закрытие по клику на ссылку
	navLinks.forEach(link => {
		link.addEventListener('click', function (e) {
			// Для якорных ссылок предотвращаем стандартное поведение
			if (this.getAttribute('href').startsWith('#')) {
				e.preventDefault();

				// Закрываем меню
				closeMobileNav();

				// Плавный скролл к якорю
				const targetId = this.getAttribute('href');
				const targetElement = document.querySelector(targetId);
				if (targetElement) {
					targetElement.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				}
			} else {
				// Для обычных ссылок просто закрываем меню
				closeMobileNav();
			}
		});
	});

	// Закрытие по клику вне меню (опционально)
	// document.addEventListener('click', function (e) {
	// 	if (nav.classList.contains('mobile-nav--open') &&
	// 		!nav.contains(e.target) &&
	// 		!navBtn.contains(e.target)) {
	// 		closeMobileNav();
	// 	}
	// });

	// Закрытие по Escape (опционально)
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && nav.classList.contains('mobile-nav--open')) {
			closeMobileNav();
		}
	});
}

export default mobileNav;