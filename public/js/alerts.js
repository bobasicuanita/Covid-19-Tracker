import {
    markupNotification
} from './markups.js';
import {
    btn
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

    // display alert
    alert.insertAdjacentHTML('afterbegin', markupNotification(input));
    alert.setAttribute('style', 'visibility:visible');

    // hide it after 5 seconds.
    window.setTimeout(hideAlert, 5000);
};