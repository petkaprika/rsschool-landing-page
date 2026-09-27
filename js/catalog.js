import { products } from './products.js';

const menu = document.querySelector('.menu__grid');

initMenu();
addCategoryClickSwitching();

function addCategoryClickSwitching() {
    document.querySelector('.menu__tabs').addEventListener('click', (e) => {
        if (e.target.closest('.menu__tab')) {
            const clickedTab = e.target.closest('.menu__tab');

            removeSelectedTabs();
            selectClickedTab(clickedTab);

            const category = clickedTab.innerText;

            const filteredProducts = filterProducts(category, products);
            renderProducts(filteredProducts);

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

function renderProducts(filteredProducts) {
    menu.replaceChildren();

    const fragment = document.createDocumentFragment();

    filteredProducts.forEach(product => fragment.append(createProductCard(product)));

    menu.append(fragment);

}

function createProductCard(product) {
    const article = document.createElement('article');
    article.classList.add('card');

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

    const category = firstTab.innerText;
    const filteredProducts = filterProducts(category, products);

    renderProducts(filteredProducts);
}










