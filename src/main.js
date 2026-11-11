import { m } from './paraglide/messages.js';

const loads = Number(sessionStorage.getItem('loads') ?? 0) + 1;
sessionStorage.setItem('loads', String(loads));

document.querySelector('#greeting').textContent = m.hello();
document.querySelector('#loads').textContent = String(loads);
