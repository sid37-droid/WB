// API
const api = "https://64e0a61250713530432c8908.mockapi.io/cart";
// Контейнер товаров к заказу
const cartItems = document.querySelector(".cart__items-container");
//Чекбокс "выбрать все"
const checkBoxAll = document.querySelector(".all");
// Форма
const formSumTotal = document.querySelector(".form__sum");
const formItemsTotal = document.querySelector(".list__items-total");
const formSumTotalNoDiscount = document.querySelector(
  ".list2__total-nodiscount"
);
const formDiscount = document.querySelector(".list2__discount");
// Модальное Окно (контейнер)
const modaleWindowContainer = document.querySelector(".modal__wrapper");
// Див показывающий выбранную карту
const displayCardDiv = document.querySelector(
  '[data-displayCard="displayCard"]'
);

// Блок карты
const card = document.querySelectorAll(".card");
const adress = document.querySelector(".datails__item");

//Инпуты
const tel = document.getElementById("tel");
const tin = document.getElementById("tin");

// Товары
let cart = [];
let cartForm = [];
let cartRender = [];

// Карта
let info = [
  {
    readyToOrder: true,
    id: 0,
    num: `1234 56•• •••• 1234`,
    image: `./img/icons/mir.svg`,
  },
  {
    readyToOrder: true,
    id: 0,
    adress: "Бишкек, улица Табышалиева, 57",
  },
];

// Кнопки
let buttonsDOM = [];

// Форматирование
//* сделать класс, с товарами тоже, метод static
priceFormatter = (n) => Intl.NumberFormat().format(Number(n));

// Запрос на получение товаров
class Products {
  async getProducts() {
    try {
      let result = await fetch(api);
      let products = await result.json();
      return products;
    } catch (error) {
      console.log("error", error);
    }
  }
}

class UI {
  // Рендер карточек товара
  displayProducts(data) {
    let result = "";
    data.forEach((data) => {
      let itemLeft = parseInt(data.left) < 10 ? true : false;
      //! получаем строку, не число
      data.priceTotal = priceFormatter(data.price * data.amount);
      const itemInfo = (data) => {
        if (data.color && data.size) {
          return `<div class="cart__productColorSize">
                            <div class="cart__productColor">Цвет: ${data.color}</div>
                            <div class="cart__productSize">Размер: ${data.size}</div>
                         </div> `;
        } else if (data.size) {
          return `<div class="cart__productColorSize">
                            <div class="cart__productSize">Размер: ${data.size}</div>
                         </div> `;
        } else if (data.color) {
          return `<div class="cart__productColorSize">
                            <div class="cart__productColor">Цвет: ${data.color}</div>
                         </div> `;
        } else {
          return ``;
        }
      };

      let str = data.title;
      if (window.innerWidth <= 600) {
        if (data.title.length > 30) {
          // let str = data.title
          // console.log(str)
          let maxLength = 47;
          for (let i = 0; i < data.title.length; i++) {
            str = data.title.slice(0, maxLength - 3) + "...";
          }
          // console.log(data.title.charAt(30))
          // console.log(data.title.charAt(30))
        }
      } else {
        let maxLength = data.title.length;
        for (let i = 0; i < data.title.length; i++) {
          // console.log(data.title.length)
          str = data.title;
        }
      }

      result += `<div class="cart__product cart__item">
                        <div class="cart__ViewAndCharacters">
                            <div class="cart__productView">
                                <label class="cart__checkbox product__checkbox">
                                ${
                                  data.readyToOrder
                                    ? `<input type="checkbox" checked class="checkbox-order" data-id=${data.id}>`
                                    : `<input type="checkbox" class="checkbox-order" data-id=${data.id}>`
                                }
                                    <span class="cart__checkbox" display="none"></span>
                                </label>
                                <img src="${data.img}" alt="#">
                            </div>
                            <div class="cart__productCharcters">
                                <p class="cart__productName">${str}</p>
                                    ${itemInfo(data)}
                                <p class="cart__production1">${
                                  data.warehouse
                                }</p>
                                <p class="cart__production">${data.company}</p>
                            </div>
                        </div>
                        <div class="cart__counterAndPrice">
                        <div class="cart__counerAndExtra">
                           <div class="cart__counter">
                              <button class="counter__minus" data-id=${
                                data.id
                              }>-</button>
                              <p class="counter__number">${data.amount}</p>
                              <button class="counter__plus" data-id=${
                                data.id
                              }>+</button>
                           </div>
                           ${
                             itemLeft
                               ? `<p class="counter__text">Осталось ${data.left} шт.</p>`
                               : ""
                           }
                           <div class="cart__extra">
                              <button class="cart__favorite">
                                    <svg data-id=${
                                      data.id
                                    } xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                       <path fill-rule="evenodd" clip-rule="evenodd" d="M3.03396 4.05857C2.26589 4.75224 1.76684 5.83284 1.99493 7.42928C2.22332 9.02783 3.26494 10.6852 4.80436 12.3478C6.25865 13.9184 8.10962 15.4437 9.99996 16.874C11.8903 15.4437 13.7413 13.9184 15.1956 12.3478C16.735 10.6852 17.7766 9.02783 18.005 7.4293C18.233 5.83285 17.734 4.75224 16.9659 4.05856C16.1766 3.34572 15.055 3 14 3C12.1319 3 11.0923 4.08479 10.5177 4.68443C10.4581 4.7466 10.4035 4.80356 10.3535 4.85355C10.1582 5.04882 9.84166 5.04882 9.6464 4.85355C9.59641 4.80356 9.54182 4.7466 9.48224 4.68443C8.90757 4.08479 7.86797 3 5.99995 3C4.94495 3 3.82325 3.34573 3.03396 4.05857ZM2.36371 3.31643C3.37369 2.40427 4.75202 2 5.99995 2C8.07123 2 9.34539 3.11257 9.99996 3.77862C10.6545 3.11257 11.9287 2 14 2C15.2479 2 16.6262 2.40428 17.6362 3.31644C18.6674 4.24776 19.2668 5.66715 18.9949 7.5707C18.7233 9.47217 17.5149 11.3148 15.9294 13.0272C14.3355 14.7486 12.3064 16.3952 10.3 17.9C10.1222 18.0333 9.87773 18.0333 9.69995 17.9C7.69353 16.3952 5.66443 14.7485 4.0706 13.0272C2.48503 11.3148 1.27665 9.47217 1.00498 7.57072C0.733012 5.66716 1.33249 4.24776 2.36371 3.31643Z" fill="black"/>
                                       </svg>
                              </button>
                              <button class="cart__deleted-btn">
                                    <svg  class ="cart__deleted" data-id=${
                                      data.id
                                    } xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                       <path class ="cart__deleted-style" fill-rule="evenodd" clip-rule="evenodd" d="M2.5 5C2.5 4.72386 2.72386 4.5 3 4.5H17C17.2761 4.5 17.5 4.72386 17.5 5C17.5 5.27614 17.2761 5.5 17 5.5H3C2.72386 5.5 2.5 5.27614 2.5 5Z" fill="black"/>
                                       <path class ="cart__deleted-style" fill-rule="evenodd" clip-rule="evenodd" d="M3.4584 4.5H16.5059L15.6411 15.6926C15.5405 16.9947 14.4546 18 13.1486 18H6.84639C5.54299 18 4.45829 16.9986 4.35435 15.6994L3.4584 4.5ZM4.5416 5.5L5.35117 15.6196C5.41353 16.3992 6.06435 17 6.84639 17H13.1486C13.9322 17 14.5837 16.3968 14.6441 15.6155L15.4256 5.5H4.5416Z" fill="black"/>
                                       <path class ="cart__deleted-style" fill-rule="evenodd" clip-rule="evenodd" d="M13 5.5H7V3.46875C7 2.65758 7.65758 2 8.46875 2H11.5312C12.3424 2 13 2.65758 13 3.46875V5.5ZM8.46875 3C8.20987 3 8 3.20987 8 3.46875V4.5H12V3.46875C12 3.20987 11.7901 3 11.5312 3H8.46875Z" fill="black"/>
                                       </svg>
                              </button>
                           </div>
                        </div>
                        <div class="cart__price">
                           <p>${data.priceTotal}<span>com</span></p>
                           <p class="cart__price-old">${priceFormatter(
                             data.pricePrev
                           )} com</p>
                        </div>
                     </div>
                    </div>
                    <div class="cart__line item__line">
                    <hr>
                     </div>
                    `;
    });
    cartItems.innerHTML = result;
  }
  //Логика чекбоксов
  getCheckboxes() {
    // Получаем чекбоксы
    const checkBoxes = [...document.querySelectorAll(".checkbox-order")];
    //  buttonsDOM = checkBoxes;
    checkBoxes.forEach((checkBox) => {
      checkBox.addEventListener("change", (event) => {
        switch (true) {
          case event.target.dataset.id === "all":
            if (event.target.checked === false) {
              cartRender = cartRender.map((product) => ({
                ...product,
                readyToOrder: false,
              }));
              cartForm = [];
              this.setCartValues(cartForm);
              this.displayProducts(cartRender);
              this.getCheckboxes();
            } else {
              cartRender = cartRender.map((product) => ({
                ...product,
                readyToOrder: true,
              }));
              cartForm = cartRender;
              this.setCartValues(cartForm);
              this.displayProducts(cartRender);
              this.getCheckboxes();
            }
            break;
          default:
            if (event.target.checked === false) {
              checkBoxAll.checked = false;
              let id = event.target.dataset.id;
              let foundItem = cartRender.find((item) => item.id === id);
              cartForm = cartForm.filter((item) => item.id != foundItem.id);
              if (id == foundItem.id) {
                foundItem.readyToOrder = false;
              }
              this.setCartValues(cartForm);
            } else {
              let id = event.target.dataset.id;
              let foundItem = cartRender.find((item) => item.id === id);
              cartForm.push(foundItem);
              if (id == foundItem.id) {
                foundItem.readyToOrder = true;
              }
              this.setCartValues(cartForm);
            }
        }
      });
    });
  }
  //Передача данных в форму
  setCartValues(cartForm) {
    // Данные в форме
    let sumTotal = 0;
    let itemsTotal = 0;
    let sumTotalNoDiscount = 0;
    let discount = 0;
    // Делаем расчеты для каждого товара и передаем их в форму
    cartForm.map((item) => {
      sumTotal += parseInt(item.price * item.amount);
      itemsTotal += parseInt(item.amount);
      sumTotalNoDiscount += parseInt(item.pricePrev);
      discount = sumTotalNoDiscount - sumTotal;
    });

    //! добавить в класс
    const formatter = (value, words) => {
      value = Math.abs(value) % 100;
      var num = value % 10;
      if (value > 10 && value < 20) return words[2];
      if (num > 1 && num < 5) return words[1];
      if (num == 1) return words[0];
      return words[2];
    };
    // Отображаем данные на странице
    formSumTotal.innerText = `${priceFormatter(sumTotal)} сом`;
    formItemsTotal.innerText = `${itemsTotal} ${formatter(itemsTotal, [
      "товар",
      "товара",
      "товаров",
    ])}`;
    formSumTotalNoDiscount.innerText = `${priceFormatter(
      sumTotalNoDiscount
    )} сом`;
    formDiscount.innerText = `-${priceFormatter(discount)} сом`;
    document.querySelector(".header__cart-amount").innerText =
      cartRender.length;
    const paymentCheckbox = document.querySelector(".payment__checkbox-input");
    let totalSumButton = `Оплатить ${priceFormatter(sumTotal)}`;
    //  прописать метод
    const payment__checkboxChange = () => {
      if (paymentCheckbox.checked === true) {
        document.querySelector(".form__button-text").innerText = totalSumButton;
      } else {
        document.querySelector(".form__button-text").innerText = "Заказать";
      }
    };
    payment__checkboxChange();
    paymentCheckbox.addEventListener("change", () => {
      payment__checkboxChange();
    });
  }
  //Увеличение и уменьшенеие товаров в корзине
  cartLogic() {
    cartItems.addEventListener("click", (event) => {
      if (event.target.classList.contains("cart__deleted")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        this.removeItem(id);
        //для конкретных данных ...переписать
        let foundItem = cartRender.find((item) => item.id === id);
        if (id === foundItem.id) {
          cartRender.filter((item) => item.id !== foundItem.id);
        }
        this.displayProducts(cartRender);
        this.setCartValues(cartForm);
        this.getCheckboxes();
      }
      if (event.target.classList.contains("counter__plus")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let itemToIncrease = cartRender.find((item) => item.id === id);
        if (itemToIncrease.left > 0) {
          itemToIncrease.amount = parseInt(itemToIncrease.amount) + 1;
          itemToIncrease.left = parseInt(itemToIncrease.left) - 1;
        }
        let prev = itemToIncrease.fixedPricePrev;
        itemToIncrease.pricePrev = prev * parseInt(itemToIncrease.amount);
        this.displayProducts(cartRender);
        this.setCartValues(cartForm);
        this.getCheckboxes();
      }
      if (event.target.classList.contains("counter__minus")) {
        let subAmount = event.target;
        let id = subAmount.dataset.id;
        let itemToDecrease = cartRender.find((item) => item.id === id);
        if (parseInt(itemToDecrease.amount) > 1) {
          itemToDecrease.amount = parseInt(itemToDecrease.amount) - 1;
          itemToDecrease.left = parseInt(itemToDecrease.left) + 1;
          let prev = itemToDecrease.fixedPricePrev;
          itemToDecrease.pricePrev = parseInt(itemToDecrease.pricePrev - prev);
          this.displayProducts(cartRender);
          this.setCartValues(cartForm);
          this.getCheckboxes();
        } else {
          return;
        }
      }
    });
  }
  //Удаление товара
  removeItem(id) {
    cartRender = cartRender.filter((item) => item.id !== id);
    cartForm = cartForm.filter((item) => item.id !== id);
    this.displayProducts(cartRender);
    this.setCartValues(cartForm);
    this.getCheckboxes();
  }
  accordion(item) {
    document.querySelectorAll(".cart__up").forEach((event) => {
      event.addEventListener("click", (event) => {
        if (event.target.classList.contains("cart__up-inStock")) {
          cartItems.classList.toggle("up");
          event.target.classList.toggle("rotate");
        } else {
          document.querySelector(".soldOut__products").classList.toggle("up");
          event.target.classList.toggle("rotate");
        }
      });
    });
  }
  resize() {
    window.addEventListener("resize", (e) => {
      this.displayProducts(cartRender);
    });
  }
}

class Modal {
  // Рендер модального окна с картами
  displayModalCard() {
    let modalCards = "";
    let modalCardsInput = "";
    let dataPayment = this.modalCardData();

    dataPayment.forEach((data) => {
      modalCardsInput += `
                        <li class="cards__item">
                           <label data-radio=${
                             data.id
                           } class="cards__item-label item-labelCard">
                             ${
                               data.readyToOrder
                                 ? `<input checked  type="radio" name="a">`
                                 : `<input  type="radio" name="a">`
                             } 
                              <div data-id=${
                                data.id
                              } class="payment__card card-modal">
                                 <img src="${data.image}" alt"#">
                                 <p>${data.num}</p>
                              </div>
                           </label>
                        </li>
                        `;
    });

    modalCards = `
            <div class="modal">
               <div class="modal__container">
                  <div class="modal__header">
                     <h2>Способ оплаты</h2>
                     <button class="close"  data-card="card">
                        <svg data-card="card" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.92961 18.1568C4.53909 18.5473 4.53909 19.1805 4.92961 19.571C5.32014 19.9615 5.9533 19.9615 6.34383 19.571L12.0008 13.914L17.658 19.5711C18.0485 19.9616 18.6817 19.9616 19.0722 19.5711C19.4627 19.1806 19.4627 18.5474 19.0722 18.1569L13.4151 12.4998L19.0717 6.84309C19.4623 6.45257 19.4623 5.8194 19.0717 5.42888C18.6812 5.03836 18.0481 5.03836 17.6575 5.42888L12.0008 11.0856L6.34427 5.42899C5.95374 5.03846 5.32058 5.03846 4.93005 5.42899C4.53953 5.81951 4.53953 6.45267 4.93005 6.8432L10.5866 12.4998L4.92961 18.1568Z" fill="#A0A0A4"/>
                        </svg>
                     </button>
                  </div>
                  <div class="modal__payment-cards">
                     <ul class="cards__list">
                     ${modalCardsInput}
                     </ul>
                  </div>
                  <div class="modal__footer">
                     <div class="modal__button" data-chooseCard="chooseCard">
                        <button class="close" data-chooseCard="chooseCard">Выбрать</button>
                     </div>
                  </div>
               </div>
            </div>
                  `;
    document.querySelector(".modal__wrapper").innerHTML = modalCards;
    this.getCard(this.modalCardData());
  }
  // Рендер модального окна с адрессам
  displayModalAdress(dataAdress) {
    let modalAdress = "";
    let modalAdresInput = ``;

    dataAdress.forEach((data) => {
      modalAdresInput += `
                              <li class="adress__item">
                                 <label data-radio=${
                                   data.id
                                 } class="adress__item-label item-label">
                                    ${
                                      data.readyToOrder
                                        ? `<input type="radio" checked name="adress"></input>`
                                        : `<input type="radio" name="adress"></input>`
                                    }
                                    <div class="adress__container">
                                       <p>${data.adress}</p>
                                       <button data-button=${
                                         data.id
                                       }><img src="./img/icons/delete.svg" alt"#"></button>
                                    </div>
                                 </label>
                              </li>
                           `;
    });

    modalAdress = `
                     <div class="modal modal__adress">
                     <div class="modal__container">
                        <div class="modal__header">
                        <h2>Способ доставки</h2>
                        <button class="close"  data-adress="adress">
                           <svg data-adress="adress" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M4.92961 18.1568C4.53909 18.5473 4.53909 19.1805 4.92961 19.571C5.32014 19.9615 5.9533 19.9615 6.34383 19.571L12.0008 13.914L17.658 19.5711C18.0485 19.9616 18.6817 19.9616 19.0722 19.5711C19.4627 19.1806 19.4627 18.5474 19.0722 18.1569L13.4151 12.4998L19.0717 6.84309C19.4623 6.45257 19.4623 5.8194 19.0717 5.42888C18.6812 5.03836 18.0481 5.03836 17.6575 5.42888L12.0008 11.0856L6.34427 5.42899C5.95374 5.03846 5.32058 5.03846 4.93005 5.42899C4.53953 5.81951 4.53953 6.45267 4.93005 6.8432L10.5866 12.4998L4.92961 18.1568Z" fill="#A0A0A4"/>
                           </svg>
                        </button>
                        </div>
                        <div class="modal__selector">
                           <button data-selfcall="selfcall" class="modal__selector-self-call">В пункт выдачи</button>
                           <button data-curier="curier" class="modal__selector-courier">Курьером</button>
                        </div>
                        <div class="modal__body">
                        <h3 class="modal__addresses">Мои адреса</h3>
                        <ul class="adress__list">
                           ${modalAdresInput}
                        </ul>
                        </div>
                        <div class="modal__footer">
                        <div class="modal__button modal__button1" data-chooseAdress="chooseAdress">
                           <button class="close" data-chooseAdress="chooseAdress">Выбрать</button>
                        </div>
                        </div>
                     </div>
                  </div>
                    `;
    document.querySelector(".modal__wrapper").innerHTML = modalAdress;
    this.getCard(this.modalAdressData());
  }
  displayModalAdress2(dataAdress) {
    let modalAdress = "";
    let modalAdresInput = ``;

    dataAdress.forEach((data) => {
      modalAdresInput += `
                        <li class="adress__item">
                           <label data-radio=${
                             data.id
                           } class="adress__item-label item-labelCard">
                              ${
                                data.readyToOrder
                                  ? `<input type="radio" checked name="adress"></input>`
                                  : `<input type="radio" name="adress"></input>`
                              }
                              <div class="adress__container">
                                 <div class="details__text details__text2">
                                    <p class="details__adress details__adress">Бишкек, улица Ахматбека Суюмбаева, 12/1</p>
                                    <p class="details__workTime"><span>4.99</span> Ежедневно с 10 до 21 </p>
                                 </div>
                                 <button data-button=${
                                   data.id
                                 }><img src="./img/icons/delete.svg" alt"#"></button>
                              </div>
                           </label>
                        </li>
                        `;
    });

    modalAdress = `
                     <div class="modal modal__adress">
                     <div class="modal__container">
                        <div class="modal__header">
                        <h2>Способ доставки</h2>
                        <button class="close"  data-adress="adress">
                           <svg data-adress="adress" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M4.92961 18.1568C4.53909 18.5473 4.53909 19.1805 4.92961 19.571C5.32014 19.9615 5.9533 19.9615 6.34383 19.571L12.0008 13.914L17.658 19.5711C18.0485 19.9616 18.6817 19.9616 19.0722 19.5711C19.4627 19.1806 19.4627 18.5474 19.0722 18.1569L13.4151 12.4998L19.0717 6.84309C19.4623 6.45257 19.4623 5.8194 19.0717 5.42888C18.6812 5.03836 18.0481 5.03836 17.6575 5.42888L12.0008 11.0856L6.34427 5.42899C5.95374 5.03846 5.32058 5.03846 4.93005 5.42899C4.53953 5.81951 4.53953 6.45267 4.93005 6.8432L10.5866 12.4998L4.92961 18.1568Z" fill="#A0A0A4"/>
                           </svg>
                        </button>
                        </div>
                        <div class="modal__selector">
                           <button data-selfcall="selfcall" class="modal__selector-self-call">В пункт выдачи</button>
                           <button data-curier="curier" class="modal__selector-courier">Курьером</button>
                        </div>
                        <div class="modal__body">
                        <h3 class="modal__addresses">Мои адреса</h3>
                        <ul class="adress__list adress__list2">
                           ${modalAdresInput}
                        </ul>
                        </div>
                        <div class="modal__footer">
                        <div class="modal__button modal__button2" data-chooseAdress="chooseAdress">
                           <button class="close" data-chooseAdress="chooseAdress">Выбрать</button>
                        </div>
                        </div>
                     </div>
                  </div>
                    `;

    document.querySelector(".modal__wrapper").innerHTML = modalAdress;
    this.getCard(this.modalAdressData());
  }
  chooseModalAdress() {
    document.addEventListener("click", (event) => {
      if (event.target.dataset.curier) {
        this.displayModalAdress(this.modalAdressData());
        document.querySelector(".modal__selector-self-call").style.border =
          "2px solid rgba(203, 17, 171, 0.15)";
        document.querySelector(".modal__selector-courier").style.border =
          "2px solid #CB11AB";
      } else if (event.target.dataset.selfcall) {
        this.displayModalAdress2(this.modalAdressData());
        document.querySelector(".modal__selector-self-call").style.border =
          "2px solid #CB11AB";
        document.querySelector(".modal__selector-courier").style.border =
          "2px solid rgba(203, 17, 171, 0.15)";
      }
    });
  }
  // данные для модальных окон
  modalAdressData() {
    const modalAdress = [
      {
        readyToOrder: true,
        id: 0,
        adress: "Бишкек, улица Табышалиева, 57",
      },
      {
        readyToOrder: false,
        id: 1,
        adress: "Бишкек, улица Жукеева-Пудовкина, 77/1",
      },
      {
        readyToOrder: false,
        id: 2,
        adress: "Бишкек, микрорайон Джал, улица Ахунбаева Исы, 67/1",
      },
    ];
    return modalAdress;
  }
  modalCardData() {
    const modalPayment = [
      {
        readyToOrder: true,
        id: 0,
        num: `1234 56•• •••• 1234`,
        image: `./img/icons/mir.svg`,
      },
      {
        readyToOrder: false,
        id: 1,
        num: `1234 56•• •••• 1234`,
        image: `./img/icons/visa.svg`,
      },
      {
        readyToOrder: false,
        id: 2,
        num: `1234 56•• •••• 1234`,
        image: `./img/icons/mastercard.svg`,
      },
      {
        readyToOrder: false,
        id: 3,
        num: `1234 56•• •••• 1234`,
        image: `./img/icons/maestro.svg`,
      },
    ];
    return modalPayment;
  }
  // открытие модального окна
  showModal() {
    document.addEventListener("click", (event) => {
      if (
        event.target.dataset.card ||
        event.target.parentElement.dataset.card
      ) {
        modaleWindowContainer.classList.toggle("hidden");
        this.getCard(this.modalCardData);
        this.displayModalCard();
      }
      if (
        event.target.dataset.adress ||
        event.target.parentElement.dataset.adress
      ) {
        modaleWindowContainer.classList.toggle("hidden");
        this.getCard(this.modalAdressData);
        this.displayModalAdress(this.modalAdressData());
        this.removeAdress(this.modalAdressData());
      }
    });
  }
  cardLogic() {
    this.showModal();
    this.chooseCard();
    this.chooseModalAdress();
  }
  getCard(data) {
    return document.addEventListener("click", (event) => {
      if (event.target.parentElement.dataset.radio) {
        let foundItem = event.target.parentElement.dataset.radio;
        let foundItemTwo = data.find((card) => card.id == foundItem);
        info = foundItemTwo;
        if (!foundItemTwo) {
          return info;
        } else {
          info = foundItemTwo;
        }
      }
    });
  }
  chooseCard() {
    document.addEventListener("click", (e) => {
      if (e.target.dataset.choosecard) {
        card.forEach((card) => {
          card.innerHTML = `
                  <div class="clearence__card">
                     <img src="${info.image}" alt="info">
                  </div>
                   ${
                     card.dataset.span
                       ? ` <p class="clearence__card-number">${info.num} <span>01/30</span></p>`
                       : ` <p class="clearence__card-number">${info.num}</p>`
                   }
                  `;
        });
        modaleWindowContainer.classList.add("hidden");
      }
      if (e.target.dataset.chooseadress) {
        adress.innerHTML = `
                                 <p class="details__title">Курьером</p>
                                 <div class="details__text">
                                    <p class="details__adress">${info.adress}</p>
                                 </div>                              
                               `;

        document.querySelector(
          ".delivery__adress"
        ).innerHTML = `<p class="delivery__adress">${info.adress}</p>`;
         document.querySelector('.delivery__title').innerHTML = `<p>Курьером</p> 
         <button type="button" class="delivery__icon" data-adress="adress"><img src="" alt="">
											<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
												<path fill-rule="evenodd" clip-rule="evenodd" d="M13.1585 3.05991L16.9401 6.84154L6.72705 17.0546L2.73544 17.8529C2.38557 17.9229 2.07711 17.6144 2.14709 17.2646L2.94541 13.273L13.1585 3.05991ZM4.17707 13.9321L13.1585 4.95072L15.0493 6.84154L6.06789 15.8229L3.70436 16.2956L4.17707 13.9321Z" fill="#CB11AB"></path>
												<path fill-rule="evenodd" clip-rule="evenodd" d="M15.9948 7.78715L12.2132 4.00552L13.6313 2.5874C14.4145 1.8042 15.6843 1.8042 16.4675 2.5874L17.4129 3.53281C18.1961 4.31601 18.1961 5.58584 17.4129 6.36904L15.9948 7.78715ZM16.4675 5.42363C16.7286 5.16256 16.7286 4.73929 16.4675 4.47822L15.5221 3.53281C15.261 3.27174 14.8378 3.27174 14.5767 3.53281L14.104 4.00552L15.9948 5.89634L16.4675 5.42363Z" fill="#CB11AB"></path>
												</svg>
										</button>
         
         
         `

        modaleWindowContainer.classList.add("hidden");
      }
    });
  }
  removeAdress(data) {
    document.addEventListener("click", (event) => {
      if (event.target.parentElement.dataset.button) {
        let id = event.target.parentElement.dataset.button;
        const foundItem = data.find((item) => item.id == id);
        data = data.filter((item) => item.id != foundItem.id);
        console.log(this.modalAdressData());
        this.displayModalAdress(data);
      }
    });
  }
}

class Input {
  removeError(input) {
    const parent = input.parentNode;
    if (parent.classList.contains("error")) {
      parent.classList.remove("error");
      parent.querySelector(".error-label").remove();
    }
  }

  createError(input, text) {
    const parent = input.parentNode;
    const errorLabel = document.createElement("label");

    errorLabel.textContent = text;
    errorLabel.classList.add("error-label");

    parent.classList.add("error");
    parent.append(errorLabel);
    document.querySelector(".clearance__form").scrollIntoView();
  }

  validation(form) {
    let result = true;
    document.querySelectorAll(".form__input").forEach((input) => {
      if (input.dataset.name) {
        if (input.value == "") {
          this.removeError(input);
          this.createError(input, "Укажите имя");
          result = false;
        } else {
          this.removeError(input);
        }
      }
      if (input.dataset.surname) {
        if (input.value == "") {
          this.removeError(input);
          this.createError(input, "Введите фамилию");
          result = false;
        } else {
          this.removeError(input);
        }
      }
      if (input.dataset.tin) {
        if (input.value == "") {
          this.removeError(input);
          this.createError(input, "Укажите ИНН");
          result = false;
        } else if (
          input.value.length != input.dataset.tin &&
          input.value != ""
        ) {
          this.removeError(input);
          this.createError(input, "Проверьте ИНН");
          result = false;
        } else {
          this.removeError(input);
        }
      }
      if (input.dataset.phone) {
        if (input.value == "") {
          this.removeError(input);
          this.createError(input, "Укажите номер телефона");
          result = false;
        } else if (input.value.length > 30) {
          this.removeError(input);
          this.createError(input, "Формат: +9 999 999 99 99");
          result = false;
        } else {
          this.removeError(input);
        }
      }
      if (input.dataset.email) {
        let reg = new RegExp(
          /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
        );
        if (input.value == "") {
          this.removeError(input);
          this.createError(input, "Укажите электронную почту");
          result = false;
        } else if (!input.value.match(reg)) {
          this.removeError(input);
          this.createError(input, "Проверьте адрес электронной почты");
          result = false;
        } else {
          this.removeError(input);
        }
      }
    });

    return result;
  }

  numberControl(inp){
   inp.addEventListener("keypress", (e) => {
      // Отменяем ввод не цифр
      if (!/\d/.test(e.key)) e.preventDefault();
    });
  }
  numberFormat(inp) {
    inp.onclick = function () {
      inp.value = "+";
    };

    let old = 0;
    inp.onkeydown = function () {
      let curLen = inp.value.length;

      if (curLen < old) {
        old--;
        return;
      }
      if (curLen == 2) inp.value = inp.value + "(";

      if (curLen == 6) inp.value = inp.value + ")";

      if (curLen == 11) inp.value = inp.value + " ";

      if (curLen == 14) inp.value = inp.value + " ";

      old++;
    };
  }

  inputLogic() {
    document.getElementById("form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.validation()
      document.querySelectorAll(".form__input").forEach((input) => {
        input.addEventListener("change", () => {
          this.validation();
        });
      });
    });

    this.numberFormat(tel);
    this.numberControl(tel);
    this.numberControl(tin);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //экземпляры
  const products = new Products();
  const ui = new UI();
  const modal = new Modal();
  const input = new Input();

  products
    .getProducts()
    .then((products) => {
      cart = products.map((product) => ({
        ...product,
        // добаваление фиксированной прошлой цены для расчетов
        fixedPricePrev: product.pricePrev,
        readyToOrder: true,
      }));
      cartRender = cart;
      cartForm = cart;
      cartFixedData = cart;
      ui.displayProducts(cartRender);
      ui.setCartValues(cartForm);
    })
    .then(() => {
      ui.getCheckboxes();
      ui.cartLogic();
      ui.removeItem();
      ui.accordion();
      ui.resize();
      modal.cardLogic();
      input.inputLogic();
    });
});
