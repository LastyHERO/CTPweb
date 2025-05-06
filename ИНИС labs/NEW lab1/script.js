let numberOfFilms = prompt('Сколько фильмов Вы уже посмотрели?', '');

while (numberOfFilms === '' || numberOfFilms === null || isNaN(numberOfFilms)) {
  numberOfFilms = prompt('Введите корректное количество просмотренных фильмов:', '');
}

const movieDict = {
  count: +numberOfFilms, 
  movies: {} 
};

for (let i = 0; i < numberOfFilms; i++) {
  let lastFilm = prompt('Один из последних просмотренных фильмов?', '');
  while (!lastFilm || lastFilm.length > 50)
  {
    alert('Некорректный ввод! Название фильма не должно быть пустым и длиннее 50 символов.');
    lastFilm = prompt('Один из последних просмотренных фильмов?', '');
  }

  let filmRating = prompt('На сколько оцените его?', '');

  while (!filmRating || isNaN(filmRating)) {
    alert('Некорректный ввод! Оценка введена некорректно.');
    filmRating = prompt('На сколько оцените его?', '');
  }

  movieDict.movies[lastFilm] = filmRating;
}

console.log(movieDict);

function buildTable(moviesObject) {
  const tableContainer = document.getElementById('movieTable');

  table = document.createElement('table');

  thead = document.createElement('thead');
  headerRow = document.createElement('tr');
  thFilm = document.createElement('th');
  thRating = document.createElement('th');

  thFilm.textContent = 'Фильм';
  thRating.textContent = 'Оценка';

  headerRow.append(thFilm, thRating);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  tbody = document.createElement('tbody');

  for (const [film, rating] of Object.entries(moviesObject)) {
    row = document.createElement('tr');
    tdFilm = document.createElement('td');
    tdRating = document.createElement('td');

    tdFilm.textContent = film;
    tdRating.textContent = rating;

    row.append(tdFilm, tdRating);
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  tableContainer.appendChild(table);
}

buildTable(movieDict.movies);