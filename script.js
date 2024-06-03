const products = [
    {
        id: 1,
        title: 'Product 1',
        description: 'Description of Product 1.',
        price: '$10.00',
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 2,
        title: 'Product 2',
        description: 'Description of Product 2.',
        price: '$15.00',
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 3,
        title: 'Product 3',
        description: 'Description of Product 3.',
        price: '$20.00',
        image: 'https://via.placeholder.com/150'
    },
    // Add more products as needed
];

let cart = [];

$(document).ready(function() {
    loadProducts();

    $('#cart-button').click(function() {
        alert('Cart functionality coming soon!');
    });

    $('#add-to-cart-button').click(function() {
        const productId = $(this).data('productId');
        addToCart(productId);
    });
});

function loadProducts() {
    const productList = $('#product-list');
    products.forEach(product => {
        const productCard = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">${product.price}</p>
                        <button class="btn btn-primary" onclick="viewProduct(${product.id})">View</button>
                    </div>
                </div>
            </div>
        `;
        productList.append(productCard);
    });
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        $('#product-image').attr('src', product.image);
        $('#product-title').text(product.title);
        $('#product-description').text(product.description);
        $('#product-price').text(product.price);
        $('#add-to-cart-button').data('productId', product.id);
        $('#productModal').modal('show');
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        $('#productModal').modal('hide');
    }
}

function updateCartCount() {
    $('#cart-count').text(cart.length);
}
