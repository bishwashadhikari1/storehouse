let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

$(document).ready(function() {
    // Load and parse the CSV file
    Papa.parse('csv_output/active_products.csv', {
        download: true,
        header: true,
        complete: function(results) {
            products = results.data;
            loadProducts(products);
            updateCartCount();
        }
    });

    $('#cart-button').click(function() {
        window.location.href = 'cart.html';
    });

    $('#add-to-cart-button').click(function() {
        const productId = $(this).data('productId');
        addToCart(productId);
    });
});

function loadProducts(products) {
    const productList = $('#product-list');
    productList.empty(); // Clear any existing products
    products.forEach((product, index) => {
        const imageUrls = product.image_urls.split(', ');
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${imageUrls[0]}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">
                            <span class="text-muted" style="text-decoration: line-through;">रु ${product.compare_at_price}</span>
                            <span class="text-danger font-weight-bold">रु ${product.price}</span>
                        </p>
                        <button class="btn btn-primary" onclick="viewProduct(${index})">View</button>
                    </div>
                </div>
            </div>
        `;
        productList.append(productCard);
    });
}

function viewProduct(index) {
    const product = products[index];
    const imageUrls = product.image_urls.split(', ');
    if (product) {
        $('#product-image').attr('src', imageUrls[0]);
        $('#product-title').text(product.name);
        $('#product-description').html(product.description); // Use .html() to render HTML description
        $('#product-price').html(`
            <span class="text-muted" style="text-decoration: line-through;">रु ${product.compare_at_price}</span>
            <span class="text-danger font-weight-bold">रु ${product.price}</span>
        `);
        $('#add-to-cart-button').data('productId', product._id);
        $('#productModal').modal('show');
    }
}

function addToCart(productId) {
    const product = products.find(p => p._id === productId);
    const cartItemIndex = cart.findIndex(item => item.id === product._id);

    if (cartItemIndex > -1) {
        cart[cartItemIndex].quantity += 1;
    } else {
        cart.push({
            id: product._id,
            name: product.name,
            price: parseFloat(product.price),
            compare_at_price: parseFloat(product.compare_at_price),
            quantity: 1,
            image: product.image_urls.split(', ')[0]
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Product added to cart');
    $('#productModal').modal('hide');
}

function updateCartCount() {
    $('#cart-count').text(cart.length);
}

function loadCart() {
    const cartList = $('#cart-list');
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryCharge = 100;
    const total = subtotal + deliveryCharge;

    cartList.empty();
    cart.forEach((item, index) => {
        const cartItem = `
            <div class="cart-item row mb-3">
                <div class="col-3">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid cart-item-image">
                </div>
                <div class="col-9">
                    <h5>${item.name}</h5>
                    <p>रु ${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQuantity(${index})">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-outline-secondary btn-sm" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm mt-2" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
        cartList.append(cartItem);
    });

    $('#subtotal').text(`रु ${subtotal}`);
    $('#delivery-charge').text(`रु ${deliveryCharge}`);
    $('#total').text(`रु ${total}`);
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function showToast(message) {
    const toast = $(`<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-body">
            ${message}
        </div>
    </div>`);
    $('.toast-container').append(toast);
    toast.toast({ delay: 2000 });
    toast.toast('show');
    toast.on('hidden.bs.toast', () => toast.remove());
}

// Checkout page function
function fillCheckoutForm() {
    const cartDetails = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    $('#cart-details').val(cartDetails);
}

$(document).ready(function() {
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    } else if (window.location.pathname.includes('checkout.html')) {
        fillCheckoutForm();
    }
});
