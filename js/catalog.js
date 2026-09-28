import { products } from './products.js';

const menu = document.querySelector('.menu__grid');
const refreshButton = document.querySelector('.menu__refresh');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.modal__close-button');
const image = document.querySelector('.modal__image');
const title = document.querySelector('.modal__title');
const descriptionText = document.querySelector('.modal__description-text');
const price = document.querySelector('.modal__total-price');

let category;
let width = window.innerWidth;
let productsQuantity;
let productPointer = 0;
const productsPerPage = 4;

initMenu();
addCategoryClickSwitching();

closeButton.addEventListener('click', () => closeModal(modal));

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal(modal);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && !modal.classList.contains('modal_hidden')) {
        closeModal(modal);
    }
});

menu.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) {
        const productName = card.dataset.name;
        const product = products.find(product => product.name === productName);
        openModal(modal, product);
    }
});

refreshButton.addEventListener('click', () => {
    const filteredProducts = filterProducts(category, products);
    productPointer += productsPerPage;
    const endIndex = productPointer > productsQuantity ? filteredProducts.length : productPointer;
    renderProducts(filteredProducts, 0, endIndex);
    showRefreshButton();
});

window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    if (width > 768 && currentWidth <= 768) {
        /*   productPointer = productsPerPage;*/
        const filteredProducts = filterProducts(category, products);
        updateProducts(filteredProducts)
    } else if (width <= 768 && currentWidth > 768) {
        const filteredProducts = filterProducts(category, products);
        updateProducts(filteredProducts);
    }
    width = currentWidth;
});

function addCategoryClickSwitching() {
    document.querySelector('.menu__tabs').addEventListener('click', (e) => {
        if (e.target.closest('.menu__tab')) {
            const clickedTab = e.target.closest('.menu__tab');

            removeSelectedTabs();
            selectClickedTab(clickedTab);

            category = clickedTab.innerText;

            const filteredProducts = filterProducts(category, products);
            productsQuantity = filteredProducts.length;

            updateProducts(filteredProducts);
        }
    });
}

function removeSelectedTabs() {
    const tabs = document.querySelectorAll('.menu__tab');
    tabs.forEach(tab => {
        tab.classList.remove('menu__tab_active');
        tab.querySelector('.menu__tab-icon').classList.remove('menu__tab-icon_active');
    });
}

function selectClickedTab(clickedTab) {
    clickedTab.classList.add('menu__tab_active');
    const clickedTabIcon = clickedTab.querySelector('.menu__tab-icon');
    clickedTabIcon.classList.add('menu__tab-icon_active');
}

function filterProducts(category, products) {
    return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
}

function renderProducts(filteredProducts, startIndex = 0, endIndex) {
    menu.replaceChildren();

    const fragment = document.createDocumentFragment();

    filteredProducts.slice(startIndex, endIndex).forEach(product => fragment.append(createProductCard(product)));

    menu.append(fragment);
}

function createProductCard(product) {
    const article = document.createElement('article');
    article.classList.add('card');
    article.dataset.name = product.name;

    const img = document.createElement('img');
    img.src = `assets/images/${product.image}`;
    img.classList.add('card__image');

    const content = document.createElement('div');
    content.classList.add('card__content');

    article.append(img);
    article.append(content);

    const title = document.createElement('h2');
    title.classList.add('card__title');
    title.textContent = product.name;

    const description = document.createElement('p');
    description.classList.add('card__description');
    description.textContent = product.description;

    const price = document.createElement('p');
    price.classList.add('card__price');
    price.textContent = `$${product.price}`;

    content.append(title, description, price);

    return article;
}

function initMenu() {
    const firstTab = document.querySelector('.menu__tab');

    selectClickedTab(firstTab);

    category = firstTab.innerText;
    const filteredProducts = filterProducts(category, products);
    productsQuantity = filteredProducts.length;

    updateProducts(filteredProducts);
}

function updateProducts(filteredProducts) {
    productPointer = productsPerPage;
    if (window.innerWidth <= 768) {
        renderProducts(filteredProducts, 0, productsPerPage);
    } else {
        renderProducts(filteredProducts);
    }

    showRefreshButton();
}

function showRefreshButton() {
    if (window.innerWidth <= 768 && productPointer < productsQuantity) {
        refreshButton.classList.remove('menu__refresh_hidden');
    } else {
        refreshButton.classList.add('menu__refresh_hidden');
    }
}

function openModal(modal, product) {
    modal.classList.remove('modal_hidden');
    document.body.style.overflow = 'hidden';

    image.src = `assets/images/${product.image}`;
    title.textContent = product.name;
    descriptionText.textContent = product.description;
    price.textContent = `$${product.price}`;
}

function closeModal(modal) {
    modal.classList.add('modal_hidden');
    document.body.style.overflow = '';
}










