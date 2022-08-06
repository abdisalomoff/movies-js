let elMovieList = document.querySelector(".movielist");
let elForm = document.querySelector(".form");
let elInputYear = document.querySelector(".year");
let elInputRaiting = document.querySelector(".raiting");
let elInputCategory = document.querySelector(".category");
let elInputSorting = document.querySelector(".sorting");
let elTemplate = document.querySelector("#card").content;
let elResult = document.querySelector("#result");
let elModalTitle = document.querySelector(".modal__title");
let elModalBody = document.querySelector(".modal__body");

let moviesArray = movies.slice(0,20);

// Normalize---------------
let normalizeMovies = moviesArray.map(function(item){
  return {
    id: item.imdb_id,
    title: item.Title.toString(),
    categories: item.Categories.split("|"),
    moreinfo: item.summary,
    img: `https://i.ytimg.com/vi/${item.ytid}/mqdefault.jpg`,
    videoUrl: `https://www.youtube.com/watch?v=${item.ytid}`,
    rating: item.imdb_rating,
    year: item.movie_year,
  }
})

// Categories--------------
function getCategories(array) {
    let newArray = []

    array.forEach(item => {
        let oneMovieCategories = item.categories;
        oneMovieCategories.forEach(item1 => {
            if (!newArray.includes(item1)) {
                newArray.push(item1)
            }
        })
    });

    return newArray
}

let categoriesArray = getCategories(normalizeMovies).sort();

function renderCategories(array, wrapper) {
    let fragment = document.createDocumentFragment();

    for (const item of array) {
        let newOption = document.createElement("option");
        newOption.textContent = item;
        newOption.value = item;
        fragment.appendChild(newOption);
    }
    
    wrapper.appendChild(fragment);
}
renderCategories(categoriesArray, elInputCategory);

// Render-----------------
function render(array, movielist) {
  movielist.innerHTML = null;
  // elResult.textContent = array.length;
  let fragment = document.createDocumentFragment();

  for (const item of array) {
    let templateItem = elTemplate.cloneNode(true);

    templateItem.querySelector(".img-movie").src = item.img;
    templateItem.querySelector(".title-movie").textContent = item.title;
    templateItem.querySelector(".year-movie").textContent = item.year;
    templateItem.querySelector(".raiting-movie").textContent = item.rating;
    templateItem.querySelector("#categories").textContent = item.categories;
    templateItem.querySelector(".trailer-movie").href = item.videoUrl;
    templateItem.querySelector(".more-info-btn").dataset.moviesId = item.id;


    fragment.appendChild(templateItem);
  }
  movielist.appendChild(fragment);
}
render(normalizeMovies, elMovieList);



elForm.addEventListener("submit", function(evt) {
  evt.preventDefault();

  let inputYear = elInputYear.value.trim();
  let inputRaiting = elInputRaiting.value.trim();
  let inputCategory = elInputCategory.value.trim();
  let inputSort = elInputSorting.value.trim();

  let filteredArray = normalizeMovies.filter(function(item){

  let isTrue = inputCategory == "all" ? true: item.categories.includes(inputCategory);
  let validation = item.year >= inputYear && item.rating >= inputRaiting && isTrue;

  return validation;
  })

  if (inputSort == "ratingHighToLow") {
    filteredArray.sort((a, b) => {
        return b.rating - a.rating
    })  
}

if (inputSort == "ratingLowToHigh") {
    filteredArray.sort((a, b) => {
        return a.rating - b.rating
    })  
}

if (inputSort == "yearHighToLow") {
    filteredArray.sort((a, b) => {
        return b.year - a.year
    })  
}

if (inputSort == "yearLowToHigh") {
    filteredArray.sort((a, b) => {
        return a.year - b.year
    })  
}


render(filteredArray, elMovieList);
})


elMovieList.addEventListener("click", function(evt){
  let currentMoviesId = evt.target.dataset.moviesId;

  if (currentMoviesId){
    let foundMovies = normalizeMovies.find(function(item){
      return item.id == currentMoviesId;
    })
    elModalTitle.textContent = foundMovies.title;
    elModalBody.textContent = foundMovies.summary;
  }
})
