/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.selectElement = this.element.querySelector('.accounts-select');
    this.renderAccountsList();
  }

  getActiveAccountId() {
    let accountId = '1';
    let selectedAccount = App.getWidget('accounts').selectedAccount;
    if (selectedAccount) {
      accountId = selectedAccount.dataset.id;
    }
    return accountId;
  }

  addAccounsSelectorItem(item) {
    const optionElement = document.createElement("option");
    const accountId = this.getActiveAccountId();
    this.selectElement.appendChild(optionElement);
    optionElement.setAttribute('value', item.id);
    if (item.id === accountId) {
      optionElement.setAttribute('selected', 'selected');
    }
    optionElement.textContent = item.name;
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const _user = User.current();
    if (_user) {
      Account.list(_user, (err, request) => {
        if (request && request.success) {
          this.selectElement.innerHTML = '';
          request.data.forEach(value => {
            this.addAccounsSelectorItem(value);
          });
        }
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (err) {
        alert(`${err.status} - ${err.message}`);
      } else {
        if (response) {
          if (response.success) {
            App.update();
            App.getModal(this.element.id === 'new-expense-form' ? 'newExpense' : 'newIncome').close();
          } else {
            alert(response.error);
          }
          this.element.reset();
        }
      }
    });
  }
}
