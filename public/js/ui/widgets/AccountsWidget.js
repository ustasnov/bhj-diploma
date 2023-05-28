/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
    } else {
      throw `Элемент ${element} не существует!`;
    }
    this.selectedAccount = null;
    this.registerEvents();
    this.update();
  }

  createAccountClickHandler(event) {
    event.preventDefault();
    App.getModal('createAccount').open();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountButton = this.element.querySelector(".create-account");
    if (!createAccountButton.onclick) {
      createAccountButton.onclick = this.createAccountClickHandler;
    };
    const accountElements = this.element.querySelectorAll(".account");
    Array.from(accountElements).forEach(elem => {
      elem.childNodes[1].addEventListener('click', event => {
        event.preventDefault();
        this.onSelectAccount(event.currentTarget.parentNode);
      });
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const _user = User.current();
    if (_user) {
      Account.list(_user, (err, request) => {
        if (request && request.success) {
          this.clear();
          request.data.forEach(value => {
            this.renderItem(value);
          });
          this.registerEvents();
          if (this.selectedAccount) {
            const accounts = this.element.querySelectorAll('.account');
            const account = Array.from(accounts)
              .find(elem => { return elem.dataset.id === this.selectedAccount.dataset.id });
            if (account) {
              this.onSelectAccount(account);
            }
          }
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accountElements = this.element.querySelectorAll(".account");
    Array.from(accountElements).forEach(elem => {
      elem.parentNode.removeChild(elem);
    })
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    if (this.selectedAccount) {
      this.selectedAccount.classList.remove("active");
    }
    element.classList.add("active");
    this.selectedAccount = element;
    App.showPage('transactions', { account_id: element.dataset.id });
    App.updateForms();
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return `<li class="account menu-item" data-id="${item.id}">
      <a href="#">
        <span>${item.name}</span>
        <span class="pull-right">${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', currencyDisplay: "symbol" }).format(item.sum)}</span>
      </a>
    </li>`;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const accountElement = document.createElement("li");
    this.element.appendChild(accountElement);
    accountElement.outerHTML = this.getAccountHTML(data);
  }
}
