let container = document.querySelector('.container')
let site2 = document.querySelector('.site2')
let button = document.querySelector('a')

button.addEventListener('click', (e) =>  {
  e.preventDefault()
  container.classList.add('transition')

});

button.addEventListener('click', (e) => {
  e.preventDefault()
  setTimeout(() => {
    location.replace('jeux\\index.html')
  }, 285)

})
