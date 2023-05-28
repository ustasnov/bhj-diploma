/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest;
  let url = options.url;

  let formData = null;
  if (options.data) {
    if (options.method === 'GET') {
      let i = 0;
      for (const [key, value] of Object.entries(options.data)) {
        url += `${i === 0 ? "?" : "&"}${key}=${value}`;
        i++;
      }
    } else {
      if (options.data instanceof HTMLFormElement) {
        formData = new FormData(options.data);
      } else {
        formData = new FormData();
        for (const [key, value] of Object.entries(options.data)) {
          formData.append(key, value);
        }
      }
    }
  }

  try {
    xhr.open(options.method, url);

    xhr.addEventListener("load", event => {
      if (xhr.status !== 200) {
        options.callback({ status: `${xhr.status}`, message: `${xhr.statusText}` }, null);
      } else
        options.callback(null, JSON.parse(xhr.response));
    });

    xhr.addEventListener("error", (event) => {
      options.callback({ status: `${xhr.status}`, message: `${xhr.statusText}` }, null);
    });

    if (formData) {
      xhr.send(formData);
    } else {
      xhr.send();
    }
  } catch (e) {
    console.error("Произошла ошибка: " + e);
  }
}

