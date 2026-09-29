import { products } from './products.js';

const menu = document.querySelector('.menu__grid');
const refreshButton = document.querySelector('.menu__refresh');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.modal__close-button');
const image = document.querySelector('.modal__image');
const title = document.querySelector('.modal__title');
const descriptionText = document.querySelector('.modal__description-text');
const price = document.querySelector('.modal__total-price');
const sizeTabs = document.querySelector('.size-tabs');
const additives = document.querySelector('.additives');

let category;
let width = window.innerWidth;
let productsQuantity;
let productPointer = 0;
const productsPerPage = 4;
let currentProduct;

initMenu();
addCategoryClickSwitching();

additives.addEventListener('click', (e) => {
    const additiveButton = e.target.closest('.additives__tab');

    if (additiveButton) {
        additiveButton.classList.toggle('additives__tab_active');
        additiveButton.querySelector('.additives__tab-item').classList.toggle('additives__tab-item_active');

        const totalPrice = calculateTotalPrice();
        price.textContent = `$${totalPrice.toFixed(2)}`;
    }
});

sizeTabs.addEventListener('click', (e) => {
    const sizeButton = e.target.closest('.size-tabs__tab');
    if (sizeButton) {
        removeSelectedSizes();
        selectClickedSize(sizeButton);

        const totalPrice = calculateTotalPrice();

        price.textContent = `$${totalPrice.toFixed(2)}`;
    }
});

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
    currentProduct = product;

    modal.classList.remove('modal_hidden');
    document.body.style.overflow = 'hidden';

    image.src = `assets/images/${product.image}`;
    title.textContent = product.name;
    descriptionText.textContent = product.description;

    sizeTabs.replaceChildren();
    const sizeTabsFragment = document.createDocumentFragment();

    for (const size of Object.entries(product.sizes)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('size-tabs__tab');
        button.dataset.size = size[0].toLowerCase();

        const item = document.createElement('span');
        item.classList.add('size-tabs__item');
        item.textContent = size[0].toUpperCase();
        if (size[0].toUpperCase() === 'S') {
            button.classList.add('size-tabs__tab_active');
            item.classList.add('size-tabs__item_active');
        }
        button.append(item);
        button.append(size[1].size);
        sizeTabsFragment.append(button);
    }
    sizeTabs.append(sizeTabsFragment);

    additives.replaceChildren();
    const additivesFragment = document.createDocumentFragment();

    product.additives.forEach((additive, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('additives__tab');

        const item = document.createElement('span');
        item.classList.add('additives__tab-item');
        item.textContent = `${index + 1}`;
        button.append(item);
        button.append(additive.name);
        button.dataset.additiveIndex = index;
        additivesFragment.append(button);
    });

    additives.append(additivesFragment);

    price.textContent = `$${calculateTotalPrice().toFixed(2)}`;
}

function closeModal(modal) {
    modal.classList.add('modal_hidden');
    document.body.style.overflow = '';
}

function removeSelectedSizes() {
    const sizeButtons = sizeTabs.querySelectorAll('.size-tabs__tab');
    const sizes = sizeTabs.querySelectorAll('.size-tabs__item');
    sizeButtons.forEach(button => button.classList.remove('size-tabs__tab_active'));
    sizes.forEach(size => size.classList.remove('size-tabs__item_active'));
}

function selectClickedSize(sizeButton) {
    sizeButton.classList.add('size-tabs__tab_active');
    sizeButton.querySelector('.size-tabs__item').classList.add('size-tabs__item_active');
}

function calculateTotalPrice() {
    const sizeButton = sizeTabs.querySelector('.size-tabs__tab_active');
    let size;
    let sizePrice;
    let totalPrice = parseFloat(currentProduct.price);
    if (sizeButton) {
        size = sizeButton.dataset.size;
        sizePrice = parseFloat(currentProduct.sizes[size]['add-price']);
        totalPrice += sizePrice;
    }

    const activeAdditives = [...additives.querySelectorAll('.additives__tab.additives__tab_active')];
    const addPrice = activeAdditives.reduce((sum, additive) => {
        const index = additive.dataset.additiveIndex;
        const addPrice = parseFloat(currentProduct.additives[index]['add-price']);
        return sum + addPrice;
    }, 0);

    totalPrice += addPrice;

    return totalPrice;
}











