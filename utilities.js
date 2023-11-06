import { NO_IMAGE_AVAILABLE, N_A } from "./constants.js";

export function getPoster(poster) {
    return poster === N_A ? NO_IMAGE_AVAILABLE : poster;
}