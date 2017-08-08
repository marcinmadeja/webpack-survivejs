export default (text = 'Hello world') => {
  const element = document.createElement('div');

  element.className = 'fa fa-address-book';
  element.innerHTML = text;
  element.onclick = () => {
    require.ensure([], (require) => {
      element.textContent = require('./lazy').default;
    });
  };
  
  return element;
};
