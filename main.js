// import {fetchMovieById as fetchna} from "./apiCalls.js";
const URL = "https://www.omdbapi.com/?apikey=";
const APIKey = "c31255ba";
const favouriteMoviesList = [];
const FAVOURITE_MOVIES = "FAVOURITE_MOVIES";
const responseHtmlDiv = document.getElementById("response");

//Fetch the list of favourite movies from the local storage of the browser, if any.
function fetchDataFromLocalStorage(){
    if(localStorage.getItem(FAVOURITE_MOVIES)){
        //console.log("Data is present in local storage")
        let favouriteMoviesStringFromLocalStorage = localStorage.getItem(FAVOURITE_MOVIES);
        let favouriteMoviesArrayFromLocalStorage = JSON.parse(favouriteMoviesStringFromLocalStorage)
        //console.log(JSON.parse(favouriteMovies));
        for(let i = 0; i < favouriteMoviesArrayFromLocalStorage.length; i++){
            favouriteMoviesList.push(favouriteMoviesArrayFromLocalStorage[i]);    
        }
        //console.log(favouriteMoviesList);
        const noFavouriteMoviePresent = document.createElement("div");
        noFavouriteMoviePresent.setAttribute("style", "color: beige; font-size: large; font-weight: bold; text-align:center; width:100%;")
        noFavouriteMoviePresent.textContent = "Search for a movie...";
        responseHtmlDiv.append(noFavouriteMoviePresent);
    }else{
        console.log("Data is not present in local storage")
        localStorage.setItem(FAVOURITE_MOVIES, JSON.stringify(favouriteMoviesList));
    }
}

fetchDataFromLocalStorage();

//This function will get call on every keyup event of the searchText input
function search(){
    let searchText = document.getElementById('searchText').value;
    if(searchText.length > 0){
        fetchMovies(searchText);
    }
}

//Fetch the movies from the OMDBAPI based on the search text.
//After successful fetch, display the list on the frontend.
async function fetchMovies(searchText){
    let URL = `https://www.omdbapi.com/?apikey=${APIKey}&s=${searchText}&page=1`;
    const response = await fetch(URL);
    const data = await response.json();

    if(data.Response === "True"){
        const {Search} = data; //Destructure Search from the response data received from the API
        const wrapper = document.createElement("div");//Wrapper for the row div
        const rowDiv = document.createElement("div");//row div for the columns
        rowDiv.setAttribute("class", "row row-cols-1 row-cols-md-5 g-4");

        Search.forEach(element => {//For every movie in the search result
            const col = createCol();//col div which will store the list of movies in the form of bootsrap card
            col.append(createCard(element));//createCard() function returns the card div which contains movie details which we are appending in the col div
            rowDiv.append(col);//Appending the col div in the row div, eventually the row div will contain top 10 search results
        });

        //Had to use wrapper div around the row div because I was not able to append the row div directly into the response div
        //movies from previous search results were getting appended while using append() function with the resposeHtmlDiv
        //Hence had to use innerHTML() function.
        //innerHtml() function expects a string value, so rowDiv.innerHtml was giving unexpected results
        //Hence, had to use a wrapper div
        wrapper.append(rowDiv);
        responseHtmlDiv.innerHTML = wrapper.innerHTML;
    }
}

//Creates a col div which envetually gets appended in the row div
function createCol() {
    const col = document.createElement("div");
    col.setAttribute("class", "col");
    col.setAttribute("style", "height:300px");
    return col;
}

//Creates a card div which envetually gets appended in the col div
function createCard(element) {
    const card = document.createElement("div");
    card.setAttribute("class", "card h-100");
    card.setAttribute("style", "background-color:#343434; color:#F5F5DC");

    card.append(createPoster(element));
    card.append(createCardBody(element));
    card.append(createCardFooter(element));

    return card;
}

//Creates a cardBody div which envetually gets appended in the card div
function createCardBody(element) {
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    cardBody.setAttribute("style", "padding:0.2rem 0.2rem");

    cardBody.append(createCardTitle(element));

    cardBody.append(createCardText(element));

    return cardBody;
}

//Creates a poster div which envetually gets appended in the card div
function createPoster(element) {
    const img = document.createElement("img");
    const poster = element.Poster === "N/A" ? "./src/20231105_182112_0000.png" : element.Poster;
    img.setAttribute("src", poster);
    img.setAttribute("class", "card-img-top img-thumbnail");
    img.setAttribute("alt", "No Poster");
    img.setAttribute("style", "height:150px; width:100%; object-fit: cover; background-color:#28282B");
    return img;
}

//Creates a cardFooter div which envetually gets appended in the card div
function createCardFooter(element) {
    const cardFooter = document.createElement("p");
    cardFooter.setAttribute("class", "card-text");
    cardFooter.append(createViewButton(element), createAddToFavouriteButton(element));
    return cardFooter;
}

//Creates a cardTText div which envetually gets appended in the cardBody div
function createCardText(element) {
    const cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.textContent = element.Year;
    return cardText;
}

//Creates a cardTTitle div which envetually gets appended in the cardBody div
function createCardTitle(element) {
    const cardTtile = document.createElement("p");
    cardTtile.setAttribute("class", "card-title");
    cardTtile.textContent = element.Title;
    return cardTtile;
}

//Creates a view button which envetually gets appended in the cardFooter div
function createViewButton(element) {
    const viewButton = document.createElement("button");
    viewButton.setAttribute("class", "btn");
    viewButton.setAttribute("id", element.imdbID);
    viewButton.setAttribute("style", "color:white");
    viewButton.setAttribute("onClick", `viewMovieDetails(this.id)`);
    viewButton.textContent = "View";
    return viewButton;
}

//Creates an add to favourite button which envetually gets appended in the cardFooter div
function createAddToFavouriteButton(element) {
    const addToFavouriteButton = document.createElement("button");
    addToFavouriteButton.setAttribute("class", "btn");
    addToFavouriteButton.setAttribute("id", element.imdbID);
    addToFavouriteButton.setAttribute("style", "color:white");
    addToFavouriteButton.setAttribute("onClick", `addToFavourite(this.id)`);
    addToFavouriteButton.textContent = "Favourite";
    return addToFavouriteButton;
}

//Function to handle view movei details click event which navigates to the movie.html page
function viewMovieDetails(imdbID){
    let url = './movie.html';
    window.location = `${url}?id=${imdbID}`;//setting imdbID in the query string parameter which will be used on the movie.html page
}

//Function to handle add movei to favourite click event
async function addToFavourite(imdbID){
    //Check if movie is present in the list 
    const movieFound = favouriteMoviesList.find(movie => movie.imdbID === imdbID);
    
    if(movieFound){//if present
        //Show the warning alert for 4 seconds by marking warning-alert-wrapper as visible and then hiding it again
        const warningAlertWrapper = document.getElementById("warning-alert-wrapper");
        warningAlertWrapper.setAttribute("style", "display:block");
        setTimeout(function() { 
            warningAlertWrapper.setAttribute("style", "display:none");
        }, 4000);
    }else{//If not present
        //Fetch movie by imdbID
        const data = await fetchMovie(imdbID);
        
        //create a new movie object and store the data in it.
        const favouriteMovie = {"imdbID" : imdbID, "data" : data}

        //Push the object in the list
        favouriteMoviesList.push(favouriteMovie);

        //Update the local storage as well
        localStorage.setItem(FAVOURITE_MOVIES, JSON.stringify(favouriteMoviesList));
        
        //Show the success alert for 4 seconds by marking alert-wrapper as visible and then hiding it again
        const alertWrapper = document.getElementById("alert-wrapper");
        alertWrapper.setAttribute("style", "display:block");
        setTimeout(function() { 
            alertWrapper.setAttribute("style", "display:none");
        }, 4000);
    }
}

//Fetch the movie by ID from the OMDB API
async function fetchMovie(id){
    let URI = `${URL}${APIKey}&i=${id}`;
    const response = await fetch(URI);
    const data = await response.json();
    return data;
}

//Nvaigate to favouriteMovies.html page
function favouriteMoviesTab(){
    //console.log("yep")
    let url = './favouriteMovies.html';
    window.location = `${url}`;
}