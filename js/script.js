const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCounter = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const dateSpan = document.getElementById("date-span");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const nav = document.querySelectorAll('.nav-item')

let cart = [];

// Menu
// Função para exibir apenas a seção "Início"
document.addEventListener("DOMContentLoaded", function() {
  const menuLinks = document.querySelectorAll('nav ul li a');

  menuLinks.forEach(function(menuLink) {
      menuLink.addEventListener('click', function(event) {
          event.preventDefault();

          const targetId = this.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);

          if (targetSection) {
              const allSections = document.querySelectorAll('.page-menu');
              allSections.forEach(function(section) {
                  section.classList.add('hidden');
              });

              targetSection.classList.remove('hidden');
          }
      });
  });
});





// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal()
  cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar o modal ao clicar o botão fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  //  console.log(event.target)
  let parentButton = event.target.closest('.add-to-cart-btn')

  if (parentButton) {
    const name = parentButton.getAttribute('data-name')
    const price = parseFloat(parentButton.getAttribute('data-price'))

    addToCart(name, price)

  }
})

// Função para adicionar no carrinho
function addToCart(name, price) {

  const existingItem = cart.find(item => item.name === name)

  if (existingItem) {
    //Se o item ja existe, aumenta apenas a quantidade + 1
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    })
  }

  updateCartModal()

}

// Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">${item.name}</p>  
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>

        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
    </div>
    `

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: 'currency',
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

// Função para remover item do carrinho

cartItemsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove-from-cart-btn')) {
    const name = event.target.getAttribute('data-name')

    removeCartItemCart(name)
  }
})


function removeCartItemCart(name) {
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1)
    updateCartModal();
  }
}

addressInput.addEventListener('input', function (event) {
  let inputValue = event.target.value;

  if (inputValue !== '') {
    addressInput.classList.remove('border-red-500')
    addressWarn.classList.add('hidden')
  }
})






// Finalizar pedido
checkoutBtn.addEventListener('click', function () {

  const isOpen = checkIsOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, as maquinas estão descansando neste momento!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444)",
      },
      onClick: function () { } // Callback after click
    }).showToast();

    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === '') {
    addressWarn.classList.remove('hidden')
    addressInput.classList.add('border-red-500')
    return
  }

  //Enviar pedido para api whats
  const cartItems = cart.map((item) => {
    return (
      `${item.name}\n Quantidade: (${item.quantity})\n Preço: R$${item.price} \n\n`
        `${cart.total}` //verificar erro
    )
  }).join('')

  const message = encodeURIComponent(cartItems);
  const phone = '+351911777657'

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, '_blanck')


  cart.length = 0;
  updateCartModal();
})


// Verificar a hora e manipular o card horario
function checkIsOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
  //true = restaurante esta aberto
}


const spanItem = document.getElementById('date-span')
const isOpen = checkIsOpen()

if (isOpen) {
  spanItem.classList.remove('bg-red-500');
  spanItem.classList.add('bg-green-600')
} else {
  spanItem.classList.remove('bg-green-600');
  spanItem.classList.add('bg-red-500')
}
