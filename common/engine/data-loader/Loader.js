/**
 * @class Loader - loads properties of objects from JSON files. Used as an interface.
 */
export class Loader {

    /**
     * Constructs a new Loader object.
     */
    constructor() {
        this.json = null;
        this.jsonUrl = null;
        this.dirname = null;

        this.cache = new Map();
    }

    /**
     * Gets the JSON object at the URL.
     * @param {String} url - the URL of the JSON file.
     * @returns the JSON object of the given url.
     */
    fetchJson(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => console.error(error));
    }

    /**
     * Loads the entire JSON file.
     * @param {String} url - the URL of the JSON file. 
     */
    async load(url) {
        this.jsonUrl = new URL(url, window.location);
        this.json = await this.fetchJson(url);
    }

}