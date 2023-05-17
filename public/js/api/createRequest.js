/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  if (!options.url) {
    console.error('Не задан адрес запроса!');
    return;
  }

  if (!options.method) {
    console.error('Не задан метод запроса!');
    return;
  }

  if (!options.callback) {
    console.error('Не задана функция обратного вызова для запроса!');
    return;
  }

  const xhr = new XMLHttpRequest;
  let formData = null;

  if (options.data) {
    if (options.method === 'GET') {
      options.url += '?';
      let i = 0;
      for (const [key, value] of Object.entries(options.data)) {
        options.url += i === 0 ? '' : '&' + `${key}=${value}`;
      }
    } else {
      formData = new FormData();
      for (const [key, value] of Object.entries(options.data)) {
        formData.append(`${key},${value}`);
      }
    }
  }

  xhr.open(options.method, options.url);
  xhr.setRequestHeader('Content-Type', 'json');
  if (formData) {
    xhr.send(formData);
  } else {
    xhr.send();
  }

}
