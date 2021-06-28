function createElement(tag, props) {
  const el = document.createElement(tag.toString());
  if (props) {
    Object.keys(props).forEach((key) => {
      el.setAttribute(key, props[key]);
    });
  }
  return el;
}

const createKey = () => Math.floor(Math.random() * 50000);

const classes = {
  inputs: {
    inputFieldClass: `input-field-${createKey()}`,
    inputTextareaClass: `input-textarea-${createKey()}`,
    inputCheckboxClass: `input-checkbox-${createKey()}`,
    inputRadioClass: `input-radio-${createKey()}`,
    inputSubmitClass: `input-submit-${createKey()}`,
    inputSelectClass: `input-select-${createKey()}`,
  },
  divClass: {
    title: `title-${createKey()}`,
    inputs: `inputs-${createKey()}`,
    rowClass: `row-${createKey()}`,
    groupClass: `group-${createKey()}`,
    labelClass: `label-${createKey()}`,
    labelGroupClass: `label-group-${createKey()}`,
    formClass: `from-${createKey()}`,
  },
};

const createStyle = () => {
  const {
    inputs: {
      inputFieldClass,
      inputTextareaClass,
      inputCheckboxClass,
      inputRadioClass,
      inputSubmitClass,
      inputSelectClass,
    },
    divClass: {
      rowClass,
      labelClass,
      labelGroupClass,
      formClass,
      inputs,
      title,
    },
  } = classes;

  const style = createElement("style", { type: "text/css" });
  const colors = {
    inputBG: "#f7f8fa",
    inputBorder: "#424242",
    inputFocus: "#5181b8",
  };

  const childCss = `
      .${inputFieldClass} {
        width: 100%;
        margin: 0 2px;
        height: 38px;
        padding: 5px 6px ;
        line-height: 20px;
        font-size: 15px;
        outline: none;
        background: ${colors.inputBG};
        border-radius: 5px;
        border: 2px solid ${colors.inputBorder};
      }
      .${inputFieldClass}:focus {
        border: 2px solid ${colors.inputFocus};
      }
      .${inputTextareaClass} {
        resize: none;
        outline: none;
        height: 80px;
        padding: 7px;
        margin: 0 2px;
        border: 2px solid ${colors.inputBorder};
        background: ${colors.inputBG};
        border-radius: 5px; 
        overflow: hidden;
        font-size: 15px;
      }
      .${inputTextareaClass}:hover {
        border: 2px solid ${colors.inputBorder};
      }
      .${inputTextareaClass}:focus {
        border: 2px solid ${colors.inputFocus};
      }
      .${inputCheckboxClass} {
        width: 18px;
        height: 18px; 
      }
      .${inputRadioClass} {
        width: 15px;
        height: 15px; 
      }
      .${inputSelectClass} {
        height: 38px;
        margin: 0 2px;
        font-size: 17px;
        border: 2px solid ${colors.inputBorder};
        background: ${colors.inputBG};
        border-radius: 5px
      }
      .${inputSelectClass}:hover {
        border: 2px solid ${colors.inputBorder};
      }
      .${inputSubmitClass} {
        border: 2px solid ${colors.inputBorder};
        background: ${colors.inputBG};
        font-size: 17px;
        border-radius: 5px;
        padding: 10px 35px;
        flex: 0;
        cursor: pointer;
      }
      .${inputSubmitClass}:hover {
        border: 2px solid ${colors.inputFocus};
      }
    `.trim();

  const css = `
      .${formClass} * {
        box-sizing: border-box;
        transition: 0.1s;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }
      .${formClass} {
        width: 100%;
        display: flex;
        justify-content:center;
        flex-direction: column;     
      }
      .${title} {
        width:30%;
      }
      .${inputs} {
        width:70%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .${inputs} > * {
        flex: 1;
      }
      .${rowClass} {
        margin: 8px 0;
        width: 100%;
        display: flex;
        align-items: center;
      }
      
      .${labelGroupClass} {
        display: flex;
        align-items: center;
       
      }
      .${labelClass} {
        margin-left: 7px;
        margin-right: 3px;
        font-size: 16px;
        cursor: pointer;
      }
      ${childCss}
    `.trim();

  style.innerHTML = css;
  return style;
};

function validate(json) {
  const { url, method, form, createSubmitDefault } = json;
  let isSubmit = false;
  let jsonValidate = json;
  const error = {
    noProperty: (prop) => {
      throw new Error(`Отсутствует обязательное поле ${prop}!`);
    },
    invalidPropertyValue: (prop, value) => {
      throw new Error(`Поле ${prop} не может иметь значение ${value}!`);
    },
    structureError: () => {
      throw new Error("Ошибка структуры!");
    },
  };

  if (!url) error.noProperty("url");
  if (method !== "POST" && method !== "GET") {
    console.warn(
      `Неверное значение свойства method. Значение присвоенно по умолчанию POST.`
    );
    jsonValidate.method = "POST";
  }
  const checkInput = (input) => {
    const { type, className } = input;

    const modifyClass = className ? className : "";

    if (!type) error.noProperty("type");

    const {
      inputs: {
        inputFieldClass,
        inputTextareaClass,
        inputCheckboxClass,
        inputRadioClass,
        inputSubmitClass,
        inputSelectClass,
      },
    } = classes;

    if (
      type === "text" ||
      type === "password" ||
      type === "tel" ||
      type === "email" ||
      type === "number"
    ) {
      input.className = `${inputFieldClass} ${modifyClass}`;
    } else if (type === "textarea")
      input.className = `${inputTextareaClass} ${modifyClass}`;
    else if (type === "checkbox")
      input.className = `${inputCheckboxClass} ${modifyClass}`;
    else if (type === "radio") {
      input.className = `${inputRadioClass} ${modifyClass}`;
      if (!input.name) error.noProperty("name");
    } else if (type === "select") {
      input.className = `${inputSelectClass} ${modifyClass}`;
      if (!input.options) error.noProperty("options");
      else if (!Array.isArray(input.options))
        error.invalidPropertyValue("options", typeof input.options);
    } else if (type === "submit") {
      input.className = `${inputSubmitClass} ${modifyClass}`;
      isSubmit = true;
    } else error.invalidPropertyValue("type", type);

    return input;
  };

  const structureCheck = (arr) => {
    if (!Array.isArray(arr)) error.invalidPropertyValue("from", typeof arr);
    arr.forEach((row) => {
      if (typeof row.title !== "string" && typeof row.title !== "undefined")
        error.invalidPropertyValue("title", typeof row.title);
      if (!Array.isArray(row.inputs))
        error.invalidPropertyValue("inputs", typeof row.inputs);

      row.inputs.forEach((inputs) => {
        checkInput(inputs);
      });
    });
  };

  structureCheck(form);

  if (
    !isSubmit &&
    (createSubmitDefault || typeof createSubmitDefault === "undefined")
  ) {
    const submit = {
      inputs: [
        {
          type: "submit",
          value: "Отправить",
          className: classes.inputs.inputSubmitClass,
        },
      ],
    };
    console.warn("Submit отсутствует! Submit добавлен по умолчанию.");
    jsonValidate.form.push(submit);
  }

  return jsonValidate;
}

function generateForm(json) {
  const { url, method, form } = validate(json);
  const {
    divClass: {
      rowClass,
      labelClass,
      labelGroupClass,
      formClass,
      title,
      inputs,
    },
  } = classes;

  const newForm = createElement("form", {
    action: url,
    method,
    class: formClass,
  });

  const createInput = (el) => {
    let result;
    let input;

    if (el.type === "select") {
      input = createElement("select", { class: el.className });
      input.append(
        ...el.options.map((str) => {
          const option = createElement("option", { value: str });
          option.innerText = str;
          return option;
        })
      );
    } else if (el.type === "textarea") {
      input = createElement("textarea", { class: el.className });
    } else {
      input = createElement("input", {
        type: el.type,
        class: el.className,
      });
    }

    if (el.type == "number") {
      input.max = el.max ? el.max : "";
      input.min = el.min ? el.min : "";
    }
    if (el.placeholder) input.placeholder = el.placeholder;
    if (el.value) input.value = el.value;
    if (el.name) input.name = el.name;

    if (el.label) {
      const inputId = createKey();

      const label = createElement("label", {
        for: inputId,
        class: labelClass,
      });
      label.innerText = el.label;
      const labelGroup = createElement("div", {
        class: labelGroupClass,
      });

      input.id = inputId;
      labelGroup.append(label, input);

      result = labelGroup;
    } else result = input;

    return result;
  };

  form.forEach((el) => {
    const row = createElement("div", {
      class: rowClass,
    });
    const titleDiv = createElement("div", { class: title });
    const inputsDiv = createElement("div", { class: inputs });
    titleDiv.innerText = el.title || "";

    row.append(titleDiv, inputsDiv);

    if (el.inputs)
      el.inputs.forEach((input) => inputsDiv.append(createInput(input)));

    newForm.append(row);
  });

  newForm.append(createStyle());
  return newForm;
}

export default generateForm;
