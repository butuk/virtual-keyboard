// eslint-disable-next-line import/extensions
import buttons from './buttons.js';

export default class Keyboard {
  constructor(keyboard, textarea) {
    this.keyboard = keyboard;
    this.textarea = textarea;
    this.buttons = buttons;
    this.layout = 'en';
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

  switchCase() {
    const symbols = this.btns.filter((button) => button.classList.contains('button_symbol'));

    if (!this.caps) {
      if (this.layout === 'en') {
        symbols.forEach((symbol) => {
          // eslint-disable-next-line no-param-reassign
          symbol.innerText = symbol.getAttribute('shift-en');
        });
      } else {
        symbols.forEach((symbol) => {
          // eslint-disable-next-line no-param-reassign
          symbol.innerText = symbol.getAttribute('shift-by');
        });
      }
      this.caps = true;
    } else {
      if (this.layout === 'en') {
        symbols.forEach((symbol) => {
          // eslint-disable-next-line no-param-reassign
          symbol.innerText = symbol.getAttribute('char-en');
        });
      } else {
        symbols.forEach((symbol) => {
          // eslint-disable-next-line no-param-reassign
          symbol.innerText = symbol.getAttribute('char-by');
        });
      }
      this.caps = false;
    }
  }

  switchLanguage() {
    const symbols = this.btns.filter((button) => button.classList.contains('button_symbol'));

    if (this.layout === 'en') {
      if (this.caps) {
        symbols.forEach((symbol) => {
          // eslint-disable-next-line no-param-reassign
          symbol.innerText = symbol.getAttribute('shift-by');
        });
      } else {
        symbols.forEach((symbol) => {
          // eslint-disable-next-line no-param-reassign
          symbol.innerText = symbol.getAttribute('char-by');
        });
      }
      this.layout = 'by';
      document.getElementById('Language').innerHTML = 'BY';
    } else if (this.layout === 'by') {
      if (this.caps) {
        symbols.forEach((symbol) => {
          // eslint-disable-next-line no-param-reassign
          symbol.innerText = symbol.getAttribute('shift-en');
        });
      } else {
        symbols.forEach((symbol) => {
          // eslint-disable-next-line no-param-reassign
          symbol.innerText = symbol.getAttribute('char-en');
        });
      }
      this.layout = 'en';
      document.getElementById('Language').innerHTML = 'EN';
    }
  }

  changeTextarea(button) {
    const field = this.textarea;
    let start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const notMakingSymbols = [
      'Backspace',
      'CapsLock',
      'ShiftLeft',
      'ShiftRight',
      'ControlLeft',
      'AltLeft',
      'AltRight',
      'MetaLeft',
      'MetaRight',
      'Language',
    ];
    let content;

    // Backspace work
    if (this.textarea.selectionStart === this.textarea.selectionEnd && button.id === 'Backspace') {
      start = Math.max(0, start - 1);
    }
    if (button.id === 'Backspace') {
      this.textarea.setRangeText('', start, end);
    }

    // Enter, tab and arrows symbols
    switch (button.id) {
      case 'Enter':
        content = '\n';
        break;

      case 'Tab':
        content = '    ';
        break;

      case 'ArrowUp':
        content = '↑';
        break;

      case 'ArrowLeft':
        content = '←';
        break;

      case 'ArrowDown':
        content = '↓';
        break;

      case 'ArrowRight':
        content = '→';
        break;

      default:
        content = button.textContent;
    }

    // Entering symbols
    if (!notMakingSymbols.includes(button.id)) {
      field.setRangeText(content);
      this.textarea.selectionStart = start + content.length;
      this.textarea.selectionEnd = this.textarea.selectionStart;
      this.textarea.focus();
    }
  }

  listenEvents() {
    // Real keyboard
    document.addEventListener('keydown', (keyEvent) => {
      const button = document.getElementById(keyEvent.code);
      keyEvent.preventDefault();
      if (keyEvent) {
        button.classList.add('pressed');
      }
      if ((keyEvent.code === 'CapsLock' && !keyEvent.repeat) || keyEvent.code === 'ShiftLeft' || keyEvent.code === 'ShiftRight') {
        this.switchCase();
      } else if (keyEvent.code === 'AltLeft' || keyEvent.code === 'AltRight') {
        this.switchLanguage();
      } else {
        this.changeTextarea(button);
      }
    });

    document.addEventListener('keyup', (keyEvent) => {
      keyEvent.preventDefault();
      const button = document.getElementById(keyEvent.code);
      if (keyEvent.code === 'ShiftLeft' || keyEvent.code === 'ShiftRight') {
        this.switchCase();
      }
      button.classList.remove('pressed');
    });

    // Virtual keyboard
    this.btns.forEach((button) => {
      button.addEventListener('mousedown', (event) => {
        if (button.id === 'Language') {
          this.switchLanguage();
        }
        const eventKeyDown = new KeyboardEvent('keydown', { code: event.target.id });
        document.dispatchEvent(eventKeyDown);
      });

      button.addEventListener('mouseup', (event) => {
        const eventKeyUp = new KeyboardEvent('keyup', { code: event.target.id });
        document.dispatchEvent(eventKeyUp);
      });

      button.addEventListener('mouseout', (event) => {
        if (this.pressed) {
          const eventKeyUp = new KeyboardEvent('keyup', { code: event.target.id });
          document.dispatchEvent(eventKeyUp);
        }
      });
    });
  }
}
