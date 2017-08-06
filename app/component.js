import styles from './main.css';

export default (text = 'Hello world') => {
  const element = document.createElement('div');
  element.innerHTML = text;
  element.className = styles.redButton;
  return element;
};
