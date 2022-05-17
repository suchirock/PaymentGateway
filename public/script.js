

// cart
var cart = document.getElementById('cart')
var cartIcon = document.getElementById('cartIcon');
var cartClose = document.querySelector('.cart-btn-close');


window.addEventListener('DOMContentLoaded', ready)

function ready()
{
    cartClose.addEventListener('click', () => {
        cart.classList.add('cart-hide')
    })

    cartIcon.addEventListener('click', () => {
        if(cart.classList.contains('cart-hide')){
            cart.classList.remove('cart-hide')
        }else {
            cart.classList.add('cart-hide')
        }
    })

    // add to cart class in all product - click - pick up the parent class or the whole item

    var addToCart = document.querySelectorAll('.addToCart')
    addToCart.forEach(atc => {
        atc.addEventListener('click', () => {
            const cartItem = atc.parentElement
            const id = cartItem.dataset.itemId
            itemToCart(cartItem, id)
        })
    })

    document.querySelector('.cart-btn-checkout').addEventListener('click', checkoutCart)


}




function itemToCart(cartItem, id){
    const itemImg = cartItem.querySelector('.featured-img img').src
    const itemName = cartItem.querySelector('.product-name').textContent
    const itemPrice = cartItem.querySelector('.product-price').textContent
    console.log(itemName, itemPrice, itemImg, id)

//     //<div class="cart-item row mb-4">
//           <div class="col-3">
//              <img src="./img/product-1.jpg" alt="cart-item-1" class="cart-image">
//          </div>
//          <div class="col-6 d-flex flex-column px-2 justify-content-center align-items-start">
//              <h3 class="cart-title mb-2">
//                  Sneakers
//              </h3>
//              <p class="cart-price">
//                  $20.45
//              </p>
//          </div>
//          <div class="col-3 d-flex align-items-center">
//              <a href="#" class="btn cart-btn-remove btn-danger">Remove</a>
//          </div>
//        </div>

    const newCartItem = `<div class="cart-item row mb-4" data-item-id='${id}'>
                            <div class="col-3">
                            <img src="${itemImg}" alt="cart-item-1" class="cart-image">
                            </div>
                            <div class="col-6 d-flex flex-column px-2 justify-content-center align-items-start">
                                <h3 class="cart-title mb-2">
                                    ${itemName}
                                </h3>
                                <p class="cart-price">
                                    ${itemPrice}
                                </p>
                            </div>
                            <div class="col-3 d-flex align-items-center">
                                <a class="btn cart-btn-remove btn-danger">Remove</a>
                            </div>
                        </div>`



    document.querySelector('.cart-item-list').innerHTML += newCartItem

    updateCart(itemPrice);
    // console.log(sumTotalAmount)

    document.querySelectorAll('.cart-btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parentEle = e.target.parentElement.parentElement
            parentEle.remove()
            updateCart()
        })
    })
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto',
    token: function(token){
        var items = []
        document.querySelectorAll('.featured-item').forEach(item => {
            var cartItemId = item.dataset.itemId
            items.push({
                id: cartItemId
            })
        })

        fetch('/purchase', ({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        })).then(function(res){
            return res.json()
        }).then(function(data){
            alert(data.message)
            var cartItems = document.querySelector('.cart-item-list')
            while(cartItems.hasChildNodes()){
                cartItems.remove(cartItems.firstChild)
            }
        })
    }
})

function checkoutCart(){
    var priceElement = document.querySelector('.total-amount')
    var price = parseFloat(priceElement.textContent.replace('$', '')) * 100
    stripeHandler.open({
        amount: price
    })


}

// update cart total

function updateCart(itemPrice){
    var sumTotalAmount = 0;
    document.querySelectorAll('.cart-price').forEach(product => {
        const productPrice = parseFloat(product.textContent.replace('$', ''))
        sumTotalAmount += productPrice
    })

    sumTotalAmount = Math.round(sumTotalAmount * 100) / 100
    document.querySelector('.total-amount').textContent = `$ ${sumTotalAmount}`
}



