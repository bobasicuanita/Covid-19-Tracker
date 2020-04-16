const error = document.querySelector('.error');

error.insertAdjacentHTML('beforeend', `<h4 class="redirect">Redirecting to <a class="link" href='#'>Site Name</a> in <span class='timerClass'></span> seconds...</h4>`);

const timerClass = document.querySelector('.timerClass');

let tenSecs = 10000;
let timer = 9;

setInterval(() => {
    timerClass.innerText = `${timer}`;
    tenSecs -= 1000;
    timer -= 1;

    if (tenSecs === 0) {
        clearInterval();
        window.location.href = '/';
    }

}, 1000);