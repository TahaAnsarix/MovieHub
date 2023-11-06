const URL = "https://www.omdbapi.com/?apikey=";
const APIKey = "c31255ba"
const favouriteMoviesList = [];
const FAVOURITE_MOVIES = "FAVOURITE_MOVIES";
const responseHtmlDiv = document.getElementById("favourite-movies")

//Fetch the list of favourite movies from the local storage of the browser, if any.
function fetchDataFromLocalStorage(){
    if(localStorage.getItem(FAVOURITE_MOVIES)){
        console.log("Data is present in local storage")
        let favouriteMoviesStringFromLocalStorage = localStorage.getItem(FAVOURITE_MOVIES);
        let favouriteMoviesArrayFromLocalStorage = JSON.parse(favouriteMoviesStringFromLocalStorage)
        //console.log(JSON.parse(favouriteMovies));
        for(let i = 0; i < favouriteMoviesArrayFromLocalStorage.length; i++){
            favouriteMoviesList.push(favouriteMoviesArrayFromLocalStorage[i]);    
        }
        //console.log(favouriteMoviesList);
        if(favouriteMoviesList.length > 0){
            fetchMovies();
        }else{
            const noFavouriteMoviePresent = document.createElement("div");
            noFavouriteMoviePresent.setAttribute("style", "color: beige; font-size: large; font-weight: bold; text-align:center; width:100%;")
            noFavouriteMoviePresent.textContent = "No movies in your favourite list.";
            responseHtmlDiv.append(noFavouriteMoviePresent);
        }
    }else{
        console.log("Data is not present in local storage")
        //localStorage.setItem(FAVOURITE_MOVIES, JSON.stringify(favouriteMoviesList));
    }
}

fetchDataFromLocalStorage();

//Fetch the movies from the OMDBAPI based on the search text.
//After successful fetch, display the list on the frontend.
async function fetchMovies(){
    if(favouriteMoviesList){
        const wrapper = document.createElement("div");
        const rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row row-cols-1 row-cols-md-5 g-4");

        for(let i = 0; i < favouriteMoviesList.length; i++){
            //console.log(favouriteMoviesList[i].imdbID);
            const data = await fetchMovieById(favouriteMoviesList[i].imdbID);
            //console.log(data);
        }

        favouriteMoviesList.forEach(element => {
            //console.log(element.data)
            const child = createChild();
            child.append(createCard(element.data));
            rowDiv.append(child);
            //console.log(rowDiv)
        });
        wrapper.append(rowDiv);
        responseHtmlDiv.innerHTML = wrapper.innerHTML;
    }
}

/*
 * 
 * Below functions are ditto copy paste of the fucntions used in main.js to create the cards 
*/
function createCard(element) {
    const card = document.createElement("div");
    card.setAttribute("class", "card h-100");
    card.setAttribute("style", "background-color:#343434; color:#F5F5DC");

    card.append(createPoster(element));
    card.append(createCardBody(element));
    card.append(createCardFooter(element));

    return card;
}

function createChild() {
    const child = document.createElement("div");
    child.setAttribute("class", "col");
    child.setAttribute("style", "height:300px;"); //max-width:250px; border-radius: 15px;");
    return child;
}

function createCardFooter(element) {
    const cardFooter = document.createElement("p");
    cardFooter.setAttribute("class", "card-text");
    cardFooter.append(createRemoveButton(element));
    return cardFooter;
}

function createCardText(element) {
    const cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.textContent = element.Year;
    return cardText;
}

function createCardTitle(element) {
    const cardTtile = document.createElement("p");
    cardTtile.setAttribute("class", "card-title");
    cardTtile.textContent = element.Title;
    return cardTtile;
}

function createCardBody(element) {
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    cardBody.setAttribute("style", "padding:0.2rem 0.2rem");

    cardBody.append(createCardTitle(element));

    cardBody.append(createCardText(element));

    return cardBody;
}

function createPoster(element) {
    const img = document.createElement("img");
    const poster = element.Poster === "N/A" ? "./src/20231105_182112_0000.png" : element.Poster;
    img.setAttribute("src", poster);
    img.setAttribute("class", "card-img-top img-thumbnail");
    img.setAttribute("alt", "No Poster");
    img.setAttribute("style", "height:150px; width:100%; object-fit: cover; background-color:#28282B");
    return img;
}

function createRemoveButton(element) {
    const addToFavouriteButton = document.createElement("button");
    addToFavouriteButton.setAttribute("class", "btn");
    addToFavouriteButton.setAttribute("id", element.imdbID);
    addToFavouriteButton.setAttribute("style", "color:white");
    addToFavouriteButton.setAttribute("onClick", `removeFromFavourite(this.id)`);
    addToFavouriteButton.textContent = "Remove Favourite";
    return addToFavouriteButton;
}

async function fetchMovieById(id){
    let URI = `${URL}${APIKey}&i=${id}`;
    const response = await fetch(URI);
    const data = await response.json();
    return data;
}

//Function to handle remove movei from favourite click event
function removeFromFavourite(imdbID){
    //Find the index of the element needs to be deleted in the favourite movies list
    const movieFound = favouriteMoviesList.findIndex(movie => movie.imdbID === imdbID);
    if(movieFound > -1){//Element present. Index found
        //splice the array to delete the element
        favouriteMoviesList.splice(movieFound, 1);
        
        //Set the updated favourite movies list in the local storage
        localStorage.setItem(FAVOURITE_MOVIES, JSON.stringify(favouriteMoviesList));
        
        //Show the successful alert for 4 seconds
        const alertWrapper = document.getElementById("alert-wrapper");
        alertWrapper.setAttribute("style", "display:block");
        setTimeout(function() { 
            alertWrapper.setAttribute("style", "display:none");

            //Reload the page to reflect the updated favourite movies list
            location.reload();
        }, 4000);
    }else{//Index not found. Element not present
        console.log("movie is not present in favourite list");
    }
}