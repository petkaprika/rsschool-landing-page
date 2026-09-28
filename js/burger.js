const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const burgerMenu = document.querySelector('.burger-menu');

hamburger.addEventListener('click', () => {
    header.classList.toggle('header_open');
    document.body.classList.toggle('body_lock');
});

burgerMenu.addEventListener('click', (e) => {
    const menuLink = e.target.closest('.burger-menu__link');
    if (menuLink) {
        closeBurgerMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        if (header.classList.contains('header_open')) {
            closeBurgerMenu();
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && header.classList.contains('header_open')) {
        closeBurgerMenu();
    }
});

function closeBurgerMenu() {
    header.classList.remove('header_open');
    document.body.classList.remove('body_lock');
}
