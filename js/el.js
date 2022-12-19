// custom elements

export const used = (obj, ...funcs) => (funcs.forEach(func => func(obj)), obj);

export const appendChildren = (el, ...children) =>
  children.forEach(child => {
    if (child === null || child === undefined || child === false) {
      return;
    }

    if (Array.isArray(child)) {
      appendChildren(el, ...child);
      return;
    }

    el.appendChild(typeof (child) === "string" ? document.createTextNode(child) : child)
  });

export const __ = (tagName, attrs = null, ...children) => {
  const el = document.createElement(tagName);

  if (attrs) {
    Object.keys(attrs).forEach(name => el.setAttribute(name, attrs[name]));
  }

  appendChildren(el, ...children);

  return el;
};
