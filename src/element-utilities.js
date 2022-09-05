export const attributeValueTransformers = {
  bool: value => value !== null,
  number: value => +value,
  string: value => value ?? null,
};

export const attributeStateTransformers = {
  bool: (element, attribute, value) => {
    if (value) {
      element.setAttribute(attribute, attribute);
    } else {
      element.removeAttribute(attribute);
    }
  },
  number: (element, attribute, value) => {
    element.setAttribute(attribute, value);
  },
  string: (element, attribute, value) => {
    if (value) {
      element.setAttribute(attribute, value);
    } else {
      element.removeAttribute(attribute);
    }
  },
};

export function enableButton(button) {
  button.removeAttribute('disabled');
  button.classList.remove('disabled');
}

export function disableButton(button) {
  button.setAttribute('disabled', 'disabled');
  button.classList.add('disabled');
}

export function replaceAttributeData(elements, toReplace, replaceWith) {
  elements.forEach(element => {
    [...element.attributes].map(attribute => {
      if (attribute.value.includes(toReplace)) {
        attribute.value = attribute.value.replace(toReplace, replaceWith);
      }
    });

    if (element.tagName === 'TEMPLATE') {
      replaceAttributeData(element.content.querySelectorAll('*'), toReplace, replaceWith);
    }
  });
}
