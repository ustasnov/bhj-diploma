/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (element) {
      this.element = element;
    } else {
      throw `Элемент ${element} не существует!`;
    }
    this.lastOptions = null;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountButton = this.element.querySelector('.remove-account');
    if (!removeAccountButton.onclick) {
      removeAccountButton.onclick = event => {
        this.removeAccount();
      };
    }
    const removeTransactionButtons = this.element.querySelectorAll('.transaction__remove');
    Array.from(removeTransactionButtons).forEach(elem => {
      elem.addEventListener('click', event => {
        this.removeTransaction(event.currentTarget.dataset.id);
      });
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (confirm('Удалить счет?')) {
        Account.remove({ id: `${this.lastOptions.account_id}` }, (err, response) => {
          if (err) {
            alert(`${err.status} - ${err.message}`);
          } else {
            if (response) {
              if (response.success) {
                this.clear();
                App.updateWidgets();
                App.updateForms();
                this.lastOptions = null;
              } else {
                alert(response.error);
              }
            }
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm('Удалить транзакцию?')) {
      Transaction.remove({ id: `${id}` }, (err, response) => {
        if (err) {
          alert(`${err.status} - ${err.message}`);
        } else {
          if (response) {
            if (response.success) {
              App.update();
            } else {
              alert(response.error);
            }
          }
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        if (err) {
          alert(`${err.status} - ${err.message}`);
          return;
        } else {
          if (response) {
            if (response.success) {
              this.renderTitle(response.data.name);
            } else {
              alert(response.error);
              return;
            }
          }
        }
        Transaction.list({ account_id: response.data.id }, (err, response) => {
          if (err) {
            alert(`${err.status} - ${err.message}`);
          } else {
            if (response) {
              if (response.success) {
                this.renderTransactions(response.data);
                this.registerEvents();
              } else {
                alert(response.error);
              }
            }
          }
        });
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const title = this.element.querySelector(".content-title");
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    let dateString = new Intl.DateTimeFormat('ru-Ru', options).format(Date.parse(date));
    return dateString;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `<div class="transaction ${item.type === 'income' ? 'transaction_income' : 'transaction_expense'} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
        <!--  сумма -->
          ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', currencyDisplay: "symbol" }).format(item.sum)}
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
           <i class="fa fa-trash"></i>  
        </button>
      </div>
    </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const contentElement = this.element.querySelector('.content');
    contentElement.innerHTML = '';
    data.forEach(elem => {
      const transactionElement = document.createElement("div");
      contentElement.appendChild(transactionElement);
      transactionElement.outerHTML = this.getTransactionHTML(elem);
    });
  }
}
