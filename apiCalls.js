import { APIKey, URL } from "./constants.js";


export async function fetchMovieById(id){
    let URI = `${URL}${APIKey}&i=${id}`;
    const response = await fetch(URI);
    const data = await response.json();
    return data;
}