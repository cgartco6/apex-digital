// Full cart management with localStorage sync
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }
function addToCart(productId, name, price) {
    let existing = cart.find(i => i.id == productId);
    if (existing) existing.quantity++;
    else cart.push({ id: productId, name, price, quantity: 1 });
    saveCart();
    updateCartUI();
}
function removeFromCart(productId) {
    cart = cart.filter(i => i.id != productId);
    saveCart();
    updateCartUI();
}
function updateCartUI() {
    let total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    document.getElementById('cartCount').innerText = cart.length;
    document.getElementById('cartTotal').innerText = total.toFixed(2);
}
