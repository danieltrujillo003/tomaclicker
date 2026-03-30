const configRes = await fetch('../config.json');
const config = await configRes.json();
const APP_VERSION = config.version;

document.querySelectorAll('.version').forEach(el => {
    el.innerText = APP_VERSION;
});
