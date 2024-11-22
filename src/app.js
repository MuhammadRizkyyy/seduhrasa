document.addEventListener('alpine:init', () => {
  Alpine.data('products', () => ({
    items: [
      { id: 1, name: 'Coffee Beans Colombia', img: '1.jpg', price: 30000 },
      { id: 2, name: 'Becah Olice', img: '2.png', price: 35000 },
      { id: 3, name: 'Coffee Collena Beans', img: '3.png', price: 26000 },
      { id: 4, name: 'Coffee Fabium Beans', img: '4.png', price: 40000 },
      { id: 5, name: 'Coffelane Beans', img: '5.png', price: 28000 },
      { id: 6, name: 'Eolfe Beans', img: '1.png', price: 43000 },
    ],
  }));

  Alpine.store('cart', {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// validasi checkout
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove('disabled');
      checkoutButton.classList.add('disabled');
    } else {
      return false;
    }
  }

  checkoutButton.disabled = false;
  checkoutButton.classList.remove('disabled');
});

// kirim data ketika chekout button di klik
checkoutButton.addEventListener('click', function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // console.log(objData);
  const message = formatMessage(objData);
  window.open('http://wa.me/628811478570?text=' + encodeURIComponent(message));
});

// format pesan whatsapp
const formatMessage = (obj) => {
  const itemsList = JSON.parse(obj.items)
    .map((item, index) => `${index + 1}. ${item.name} (${item.quantity} x ${rupiah(item.total)})`)
    .join('\n');

  return `
==========================
        *INFORMASI CUSTOMER*
==========================
Nama   : ${obj.name}
Email  : ${obj.email}
No HP  : ${obj.phone}

==========================
         *DETAIL PESANAN*
==========================
${itemsList}

==========================
       *TOTAL PESANAN*
==========================
Total  : ${rupiah(obj.total)}

Terima kasih atas pesanan Anda!
Kami harap Anda puas dengan layanan kami.
  `;
};

// harga format rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};
