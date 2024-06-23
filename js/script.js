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
const dateScheduling = document.getElementById("date-scheduling")
const timeScheduling = document.getElementById("time-scheduling")
const addressWarn = document.getElementById("address-warn");
const nav = document.querySelectorAll('.nav-item')

let cart = [];

// Menu
// Função para exibir apenas a seção "Início"
document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll('nav ul li a');

  menuLinks.forEach(function (menuLink) {
    menuLink.addEventListener('click', function (event) {
      event.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const allSections = document.querySelectorAll('.page-menu');
        allSections.forEach(function (section) {
          section.classList.add('hidden');
        });

        targetSection.classList.remove('hidden');
      }
    });
  });
});


function mostrarSecao(id) {
  // Seleciona todas as seções
  var secoes = document.querySelectorAll('.page-menu');

  // Percorre todas as seções
  secoes.forEach(function (secao) {
    // Verifica se o ID da seção é igual ao ID passado como argumento
    if (secao.id === id) {
      // Se for igual, mostra a seção
      secao.classList.remove('hidden');
    } else {
      // Caso contrário, oculta a seção
      secao.classList.add('hidden');
    }
  });
}




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

// Função para tremer o botão
function applyShake(element) {
  // Adiciona a classe shake ao elemento clicado
  element.classList.add('shake');

  // Remove a classe shake após 1 segundo
  setTimeout(() => {
    element.classList.remove('shake');
  }, 1000);
}

// Função para adicionar no carrinho
function addToCart(name, price) {

  const existingItem = cart.find(item => item.name === name)

  if (existingItem) {
    //Se o item ja existe, aumenta apenas a quantidade + 1
    existingItem.quantity += 1;
    navigator.vibrate(200)
    const addToCartButton = document.querySelector('.add-to-cart-button');
    if (addToCartButton) {
      applyShake(addToCartButton);
    }
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    });
  }

  updateCartModal();
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
      background: "#ef4444",
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

  const dateInput = document.querySelector('input[type="date"]');
  const timeInput = document.querySelector('input[type="time"]');
  const date = dateInput.value;
  const time = timeInput.value;

  // Função para formatar a data
  function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  // Obter a data atual no formato yyyy-mm-dd
  const today = new Date().toISOString().split('T')[0];

  // Verificar se a data selecionada é anterior à data atual
  if (date < today) {
    alert("Não é possível selecionar uma data anterior à atual.");
    return;
  }

  // Função para calcular o total do carrinho
  const calculateCartTotal = (cart) => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calcula o total do carrinho
  const cartTotal = calculateCartTotal(cart).toFixed(2);

  // Construir a mensagem dos itens do carrinho
  const cartItems = cart.map((item) => {
    return (
      `${item.name}\n Quantidade: (${item.quantity})\n Preço: R$${item.price} \n\n`
    );
  }).join('');

  // Mensagem completa
  const finalMessage =
    `>> NOVO AGENDAMENTO << \n` +
    `Data: ${date}\n Hora: (${time})\n\n` +
    cartItems +
    `Total: R$${cartTotal}`;

  const message = encodeURIComponent(finalMessage);
  const phone = '+351911777657'

  window.open(`https://wa.me/${phone}?text=${message}`, '_blank')


  cart.length = 0;
  updateCartModal();
})


// Verificar a hora e manipular o card horario
function checkIsOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 10 && hora < 20;
  //true = restaurante esta aberto
}


const spanItem = document.getElementById('date-span')
const isOpen = checkIsOpen()

if (isOpen) {
  spanItem.classList.remove('border-red-500');
  spanItem.classList.remove('text-red-500');
  spanItem.classList.add('border-green-500');
  spanItem.classList.add('text-green-500');
} else {
  spanItem.classList.remove('border-green-600');
  spanItem.classList.remove('text-green-600');
  spanItem.classList.add('border-red-500');
  spanItem.classList.add('text-red-500');
}
