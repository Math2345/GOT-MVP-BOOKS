let PATH = {};

if (!true) {
    console.log("Local data");

    PATH = {
        DB_BOOK: './json/gotBook.json',
        DB_CHARACTER: './json/gotCharacters.json',
        HIDE: false
    };
} else {
    PATH = {
        DB_BOOK: "https://www.anapioficeandfire.com/api/books/",
        DB_CHARACTER: "https://anapioficeandfire.com/api/characters/",
        HIDE: true
    };
}

const EVENT = {
    REQUEST_CHARACTERS: "request_characters",
    SHOW_PAGINATION : "show_pagination",
    CLEAR_PAGINATION: "clear_pagination",
    SHOW_TBODYMODAL : "show_tbodyModal"
};



const sortingUp = (field) => {
    return (a, b) =>  {
        if (a[field] < b[field])
            return -1;
        if (a[field] > b[field])
            return 1;
        return 0;
    };
};

const sortingDown = (field) => {
    return (a, b) =>  {
        if (a[field] > b[field])
            return -1;
        if (a[field] < b[field])
            return 1;
        return 0;
    };
};


