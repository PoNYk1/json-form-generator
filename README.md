# Генератор форм из json

Привет! Этот модуль позволяет легко и быстро создать форму для отправки данных. Все что вам нужно это вставить в функцию json и функция вернет вам HTML разметку.

## Как это работает?

Как и говорилось выше, фенкция generateForm принемает json с описанием формы которую вы хотите получить.

Формат json, на примере простой формы для аутентификации, выглядит следующим образом:
```json
{
  "url": "test/url.com",
  "method": "POST",
  "createSubmitDefault": true,
  "from": [
    {
      "title": "Ваш логин",
      "inputs": [
        {
          "type": "text",
          "name": "login"
        }
      ]
    },
    
    {
      "title": "Ваш пароль",
      "inputs": [
        {
          "type": "password",
          "name": "password"
        }
      ]
    }
  ]
}
```

#### Разберем все ближе.

`"url"` : Обязательное поле. Переменная которая содержит в себе url адрес для отпраки данных.

`"method"` : Определяет метод для отправки данных, GET или POST. При отсутствии данного поля метод по умолчанию станет POST.

`"createSubmitDefault"` : По умолчанию, если в разметке будет отсутствовать Submit то алгоритм добавит его автоматически в конец разметки. 
Что-бы прервать эту проверку вы можете присвоить этой переменной значение `false`, присвоение 

`"form"` : 

