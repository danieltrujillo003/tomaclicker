const configRes = await fetch('../config.json');
const config = await configRes.json();

document.querySelectorAll('.version').forEach((el) => {
  el.innerText = config.version;
});

document.querySelectorAll('.last-updated').forEach((el) => {
  el.innerText = config.lastUpdated ?? '';
});
