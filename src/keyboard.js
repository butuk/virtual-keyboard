// eslint-disable-next-line import/extensions
import buttons from './buttons.js';

export default class Keyboard {
  constructor(keyboard, textarea) {
    this.keyboard = keyboard;
    this.textarea = textarea;
    this.buttons = buttons;
    this.layout = localStorage.getItem('language') === 'by' ? 'by' : 'en';
    this.caps = false;
    this.btns = [];
  }

  generate() {
    this.keyboard.classList.add('keyboard');

    Object.keys(buttons).forEach((buttonRow) => {
      const row = document.createElement('div');
      row.className = 'keyboard__row';
      row.id = `${buttonRow}`;

      buttons[buttonRow].forEach((button) => {
        const btn = document.createElement('button');
        btn.className = 'button';
        if (button.type === 'symbol') {
          btn.classList.add('button_symbol');
          btn.innerHTML = this.layout === 'en' ? button.en : button.by;
          btn.setAttribute('char-en', button.en);
          btn.setAttribute('shift-en', button.EN);
          btn.setAttribute('char-by', button.by);
          btn.setAttribute('shift-by', button.BY);
        } else {
          btn.classList.add('button_modifier');
          btn.classList.add(`button_size_${button.size}`);
          btn.innerHTML = button.symbol;
        }
        btn.id = button.btnName;
        row.append(btn);
        this.btns.push(btn);
      });
      this.keyboard.append(row);
    });
  }

  changeTextarea(text) {
    this.textarea.setRangeText(text);
  }

  listenEvents() {
    document.addEventListener('keydown', (keyEvent) => {
      const button = document.getElementById(keyEvent.code);
      button.classList.add('pressed');
      keyEvent.preventDefault();
      this.changeTextarea(button.textContent);
    });

    document.addEventListener('keyup', (keyEvent) => {
      const button = document.getElementById(keyEvent.code);
      button.classList.remove('pressed');
    });

    this.btns.forEach((button) => {
      button.addEventListener('mousedown', (event) => {
        const eventKeyDown = new KeyboardEvent('keydown', { code: event.target.id });
        document.dispatchEvent(eventKeyDown);
        this.pressed = true;
      });

      button.addEventListener('mouseup', (event) => {
        const eventKeyUp = new KeyboardEvent('keyup', { code: event.target.id });
        document.dispatchEvent(eventKeyUp);
        this.pressed = false;
      });

      button.addEventListener('mouseout', (event) => {
        if (this.pressed) {
          const eventKeyUp = new KeyboardEvent('keyup', { code: event.target.id });
          document.dispatchEvent(eventKeyUp);
          this.pressed = false;
        }
      });
    });
  }
}
