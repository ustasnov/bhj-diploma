/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
    } else {
      throw `Элемент ${element} не существует!`;
    }
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeButton = this.element.querySelector('.create-income-button');
    incomeButton.addEventListener('click', event => {
      if (App.getWidget('accounts').element.childNodes.length > 3) {
        App.getModal('newIncome').open();
      }
    });
    const expenseButton = this.element.querySelector('.create-expense-button');
    expenseButton.addEventListener('click', event => {
      if (App.getWidget('accounts').element.childNodes.length > 3) {
        App.getModal('newExpense').open();
      }
    });
  }
}
