let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductsHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let cartSpan = document.querySelector('.icon-cart span');

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
})

const addDataToHTML = () => {
    listProductsHTML.innerHTML = '';
    if(listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
             <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$300</div>
                <button class="addCart">Add Cart</button>`;

                listProductsHTML.appendChild(newProduct);
        })
    }
}

listProductsHTML.addEventListener('click', event => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})

const addToCart = (product_id) => {
    let positionProductInCart = carts.findIndex((value) => value.product_id == product_id);

    if(carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    } else if(positionProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        })
    } else {
        carts[positionProductInCart].quantity = carts[positionProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalquantity = 0;
    carts.forEach(cart => {
        totalquantity = totalquantity + cart.quantity;
        let newCart = document.createElement('div');
        newCart.classList.add('item');
        newCart.dataset.id = cart.product_id;
        let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
        let info = listProducts[positionProduct];
        newCart.innerHTML = `
        <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">$${info.price * cart.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
        `;
        listCartHTML.appendChild(newCart);
    })
    cartSpan.innerText = totalquantity;
}

listCartHTML.addEventListener('click', event => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
})

const changeQuantity = (product_id, type) => {
    let positionItemCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemCart >= 0){
        switch(type){
            case 'plus':
                carts[positionItemCart].quantity = carts[positionItemCart].quantity + 1;
                break;
            default:
                let valueChange = carts[positionItemCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHTML();

        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}

initApp();