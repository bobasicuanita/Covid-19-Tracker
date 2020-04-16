import {
    markupNotification
} from './markups.js';
import {
    btn,
    area
} from './domElements.js';
const alert = document.querySelector('.alert');

// Hide alert
export const hideAlert = () => {
    // set alert to invisible
    alert.setAttribute('style', 'visibility:hidden');
    // If there is already an alert remove it
    if (document.querySelector('.errortext'))
        alert.removeChild(document.querySelector('.errortext'));
};

// Show alert
export const showAlert = (input) => {
    // Hide previous alert
    hideAlert();

    btn.innerText = 'Search';
    area.insertAdjacentHTML('afterbegin', '<h3 class="guide">Click on the map to display a Country\'s Data</h3>');

    // display alert
    alert.insertAdjacentHTML('afterbegin', markupNotification(input));
    alert.setAttribute('style', 'visibility:visible');

    // hide it after 5 seconds.
    window.setTimeout(hideAlert, 5000);
};