# Генератор форм из json

Привет! Этот модуль позволяет легко и быстро создать форму для отправки данных. Все что вам нужно это вставить в функцию json и функция вернет вам HTML разметку.

## Как это работает?

Как и говорилось выше, функция generateForm принимает json с описанием формы которую вы хотите получить.

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
Давайте разберем все поподробнее.

### Свойства в json

`"url"` : Обязательное поле. Переменная которая содержит в себе url адрес для отпраки данных.

`"method"` : Определяет метод для отправки данных, GET или POST. При отсутствии данного поля метод по умолчанию станет POST.

`"createSubmitDefault"` : По умолчанию, если в разметке будет отсутствовать Submit то алгоритм добавит его автоматически в конец формы. 
Чтобы прервать эту проверку вы можете присвоить переменной значение `false`, присвоение `true` или игнорирование оставит поведение по умолчанию.

`"form"` : Обязательное поле. Это массив который содержит всю разметку формы. 
 Примерно это выглядит так:
 
 #### В json:
 
 ```json
 "form": [
  {
    "title": "Ваш заголовок",
    "inputs": [
      {
        "type": "text",
        "name": "test"
      }
    ]
  }
 ]
 ```
 
 #### В HTML:
 
 ```html
<form url="url.com" method="POST">
  <div class="row">
    <div class="title"> Ваш заголовок </div>
    <div class="inputs">
      <input type="text" name="test" />
    </div>
  </div>
</form>
```
### Принцип построения разметки

Массив `"from"` содержит в себе объекты, каждый из которых описывает новую строку в форме.

Эти объекты содержат в себе два свойства, опциональное свойство `"title"` и обязательное свойство `"inputs"`.

`"title"` : Это опциональное свойство которое может содержать в себе заготовок для строки с полями ввода. Вы можете проигнорировать это свойство, это может понадобится для создания вертикальной разметки с полями ввода как в примере ниже.

  ```json
 "form": [
  {
    "title": "Ваш пол:",
    "inputs": [
      {
        "type": "radio",
        "name": "gender",
        "label": "Мужской"
      }
    ]
  },
  {
    "inputs": [
      {
        "type": "radio",
        "name": "gender",
        "label": "Женский"
      }
    ]
  }
 ]
 ```
`"inputs"` : Это массив с обектами который описывает условную правую часть вашей формы. Как вы наверно догадались из названия, каждый обект это новое поле для ввода, их мы разберем ниже.


### Описание input

И так, у нас есть объект который описывает наш input, что он может содержать?

`"type"` : Обязательное свойство. Определяет тип для input, сейчас поддерживает типы:
  - text
  - password
  - tel
  - email
  - number
  - textarea
  - checkbox
  - radio
  - select
  - submit

`"className"` : Опциональное свойство. В течении разработки вам может потребоваться поправить изначальный дизайн для input, вы можете призвоить свой модифицирующий класс сюда.

`"placeholder"` : Опциональное свойство. Устанавливает атрибут `placeholder` для input.

`"value"` : Опциональное свойство. Устанавливает атрибут `value` для input.

`"name"` : Опциональное свойство. Устанавливает атрибут `name` для input. Для input с типом `radio` это свойство обязательно.

`"max"`, `"min"` :  Опциональное свойство. Устанавливает атрибуты `max` и `min` для input с типом `number`. Другие типы свойство игнорирует.

`"options"` : Обязательное свойство. Массив со строками на основе которого генерируется тег `option` для input с типом `select`. Другие типы свойство игнорирует.

`"label"` : Опциональное свойство. Создает `label` для вашего input где атрибут `id` будет сгенерирован автоматически. Верстка будет выглядеть следующим образом:
```html
<div class="label-group">
  <label for="key"> Ваш текст </label>
  <input id="key" />
</div>
```
## Что внутри?

Есть две основные функции которые отвечают за обработку поступившего json `validate` и `generateForm`. Их функционрал
