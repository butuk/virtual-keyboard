// eslint-disable-next-line import/extensions
import Keyboard from './keyboard.js';

const PLACE = document.createElement('div');
PLACE.className = 'container';
document.body.append(PLACE);

const HEADER = document.createElement('h1');
HEADER.innerHTML = 'Virtual MacOS keyboard';
PLACE.append(HEADER);

const TEXT_AREA = document.createElement('textarea');
PLACE.append(TEXT_AREA);

const KEYBOARD_ON_PLACE = document.createElement('div');
PLACE.append(KEYBOARD_ON_PLACE);

const DESCRIPTION = document.createElement('p');
DESCRIPTION.innerHTML = 'To switch language use ⌥ (Alt) button or generic language button at bottom left';
PLACE.append(DESCRIPTION);

const KEYBOARD = new Keyboard(KEYBOARD_ON_PLACE, TEXT_AREA);
KEYBOARD.generate();
KEYBOARD.listenEvents();

TEXT_AREA.focus();
