import { fetchMovieById } from "./apiCalls.js";
import { getPoster } from "./utilities.js";

//Fetching the query string params
const urlParams = new URLSearchParams(window.location.search);

//Fetching the id query string param which is nothing but imdbID
const id = urlParams.get('id');

//Fetch movie by id and then set its details on the frontend
async function setMovieDetails(){
    const data = await fetchMovieById(id);
    //console.log(data);
    setPoster(data);
    setCarouselDescription();
    setCarouselDescriptionTitle(data);
    setYearReleasedDateRuntimeAndRated(data);
    setActorAndDirector(data);
    setLanguageGenreAndPlot(data);
}

setMovieDetails();

//Set Language, Genre and Plot details on the frontend
function setLanguageGenreAndPlot(data) {
    const languageGenreDiv = document.createElement("div");
    languageGenreDiv.setAttribute("style", "display:flex; gap: 1rem; align-items: center; justify-content: center;");
    const language = document.createElement("p");
    language.textContent = `Language : ${data.Language}`;
    const genre = document.createElement("p");
    genre.textContent = `Genre : ${data.Genre}`;
    languageGenreDiv.append(language, genre);

    const plot = document.createElement("p");
    plot.textContent = `Plot : ${data.Plot}`;
    document.getElementById("plot").append(languageGenreDiv);
    document.getElementById("plot").append(plot);
}

//Set Actors and director details on the frontend
function setActorAndDirector(data) {
    const actorsDirector = document.getElementById("actors-director");
    const actors = document.createElement("p");
    const director = document.createElement("p");
    actors.textContent = "Actors : " + data.Actors;
    director.textContent = "Director : " + data.Director;
    actorsDirector.append(actors, director);
}

//Set Year, released date, runtime and rated details on the frontend
function setYearReleasedDateRuntimeAndRated(data) {
    const yearRatedReleased = document.getElementById("year-rated-released");
    const year = document.createElement("p");
    const rated = document.createElement("p");
    const released = document.createElement("p");
    const runtime = document.createElement("P");
    year.textContent = "Year : " + data.Year;
    rated.textContent = "Rated : " + data.Rated;
    released.textContent = "Released : " + data.Released;
    runtime.textContent = "Runtime : " + data.Runtime;
    yearRatedReleased.append(year, rated, released, runtime);
}

//Set Carousel title
function setCarouselDescriptionTitle(data) {
    const carouselDescriptionTitle = document.getElementsByClassName("title");
    //console.log(carouselDescriptionTitle);
    for (let i = 0; i < carouselDescriptionTitle.length; i++) {
        carouselDescriptionTitle[i].textContent = data.Title;
    }
}

//Set Carousel description
function setCarouselDescription() {
    const carouselDescription = document.getElementsByClassName("carousel-description");
    for (let i = 0; i < carouselDescription.length; i++) {
        carouselDescription[i].setAttribute("style", "background-color: black; opacity:0.75; color:#FBFFFF");
    }
}

//Set carousel image
function setPoster(data) {
    const images = document.getElementsByClassName("image");
    const poster = getPoster(data.Poster);
    for (let i = 0; i < images.length; i++) {
        images[i].setAttribute("src", poster);
        images[i].setAttribute("style", "height:100%; width:100%; object-fit: contain");
        images[i].setAttribute("alt", "No Poster");
    }
}