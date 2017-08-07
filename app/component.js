export default (text = 'Hello world') => {
  const element = document.createElement('div');

  element.className = 'fa fa-address-book';
  element.innerHTML = text;
  return element;
};
