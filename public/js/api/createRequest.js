const { response } = require("express");

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
  let url = new URL(options.url);

  let formData = null;
  if (options.data) {
    if (options.method === 'GET') {
      for (const [key, value] of Object.entries(options.data)) {
        url.searchParams.set(`${key}`, `${value}`);
      }
    } else {
      formData = new FormData();
      for (const [key, value] of Object.entries(options.data)) {
        formData.append(`${key},${value}`);
      }
    }
  }

  xhr.open(options.method, url);
  xhr.setRequestHeader('Content-Type', 'json');
  if (formData) {
    xhr.send(formData);
  } else {
    xhr.send();
  }

  xhr.addEventListener("load", event => {
    if (xhr.status != 200) {
      options.callback(`Ошибка ${xhr.status}: ${xhr.statusText}`, JSON.parse(xhr.response));
      //options.callback(JSON.parse(xhr.response), "");
    } else 
      options.callback("", JSON.parse(xhr.response));
    });

  xhr.addEventListener("error", (event) => {
    options.callback(`Ошибка ${xhr.status}: ${xhr.statusText}`, "");
  });
}
