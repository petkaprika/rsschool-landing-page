const slideStrip = document.querySelector('.slider__slide-strip');
const slides = document.querySelectorAll('.slide');
const slideCount = slides.length;
const controls = document.querySelectorAll('.slide__control');
const buttonPrev = document.querySelector('.slider__button_prev');
const buttonNext = document.querySelector('.slider__button_next');

let currentSlide = 0;

buttonNext.addEventListener('click', () => {
    currentSlide++;
    currentSlide %= slideCount;
    updateSlider();
});

buttonPrev.addEventListener('click', () => {
    currentSlide--;
    currentSlide = (currentSlide + slideCount) % slideCount;
    updateSlider();
});

function updateSlider() {
    slideStrip.style.transform = `translateX(${-currentSlide * 100}%)`;

    controls.forEach((control, index) => {
        control.classList.toggle('slide__control_active', index === currentSlide);
    });
}
