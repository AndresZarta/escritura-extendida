const btn = document.getElementById('boton-demo');
if (btn) {
  btn.addEventListener('click', () => {
    btn.style.backgroundColor = btn.style.backgroundColor === 'crimson' ? '' : 'crimson';
    btn.style.color = btn.style.color === 'white' ? '' : 'white';
  });
}
