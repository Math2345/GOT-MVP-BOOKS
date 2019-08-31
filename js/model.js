const ModelBook = (function () {
    let _orderSort = 'asc';

    return class {
        constructor() {
            this._bookData = [];
            this._keyMainTable = ['name', 'authors', 'publisher', 'numberOfPages', 'mediaType', 'released', 'characters'];
            this._characters = {};
            this._keyModal = ["name", "gender", "playedBy", "aliases", "culture", "titles" ];
            this._filterIdCharacters= [];
            this._settingsPagination = {
                notes: 8, // count of record on the modal table
                size: 20, // count of number buttons in the pagination
                page: 1,  // start pagination from number
                step: 3   // count of button before and after active button
            };

            this._filterPartCharacters = [];

            Object.freeze(this);
        }

        _requestDataFromFile(link) {
            return axios.get(link)
                .then((response) => {
                    return response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        }

        keyUpperCase(collection) {
            const mutatingString = (newStr, symbol, index) => {
                if (index === 0) return symbol.toUpperCase();

                if (!/[A-Z]/.test(symbol)) {
                    return newStr + symbol
                } else {
                    return newStr + ' ' + symbol;
                }

            };

            return collection.map(str => {
                return str.split('').reduce(mutatingString, '');
            });
        }

        dateFormat(str) {
            const objDate = new Date(str);

            return objDate.getFullYear() + "." + objDate.getMonth() + '.' + objDate.getDay();
        }

        linkCharacter(arr) {
            const arrIndex = arr.map(str => {
                return str.substring(str.search(/[0-9]/g), str.length)
            });

            return arrIndex.join(',');
        }


        async readData() {
            const arrayBooks = await this._requestDataFromFile(PATH.DB_BOOK);

            this._bookData.push(...arrayBooks);
        }

        async setCharactersCollection(numberCharacters) {
            const idCharacters = numberCharacters.split(","); //[1,2,3,4,5,6...]
            let charactersBuffer = {};

            if (PATH.HIDE) {
                const arrRequests = idCharacters.map(async (number) => {
                    if (!(number in this._characters)) {

                        return charactersBuffer[ number ] = await this._requestDataFromFile(PATH.DB_CHARACTER + number);
                    }
                });

                await Promise.all(arrRequests);
            } else {
                charactersBuffer = await this._requestDataFromFile(PATH.DB_CHARACTER);
            }

            Object.assign(this._characters, charactersBuffer);

            this.setArrIdCharacters(idCharacters);


            await customEvents.runListener(EVENT.REQUEST_CHARACTERS);
        }

        setArrIdCharacters(arrId) {
            const idCharacters = arrId.reduce((before, item) => {
                const characters = this._characters[item];

                if (characters) {
                    return before.concat(characters);
                }

                return before;
            }, []);

            this._filterIdCharacters.push(...idCharacters)
        }


        getPartIdCharacters() {
            const notes = this._settingsPagination.notes;

            for (let i = 0; i < notes; i++) {
                this._filterPartCharacters.push(this._filterIdCharacters[i]);
            }

            return this._filterPartCharacters;
        }

        getSliceIdCharacters(start, end) {
           return  this._filterIdCharacters.slice(start, end);
        }


        clearPartIdCharacters() {
            this._filterPartCharacters.splice(0, this._filterPartCharacters.length);
        }

        get idCharacters() {
            return this._filterIdCharacters;
        }

        get keyMainTable() {
            return this._keyMainTable;
        }

        get keyModal() {
            return this._keyModal;
        }

        setPaginationSettings(obj) {
            const getObjectData = {};
            const keySettings = Object.keys(this._settingsPagination);

            for (let key in obj) {
                if (keySettings.includes(key)) {
                    const value = obj[ key ];

                    getObjectData[ key ] = value;
                }
            }

            Object.assign(this._settingsPagination, getObjectData);
        }

        get paginationSettings() {
            return this._settingsPagination;
        }

        clearIdCharacters() {
            this._filterIdCharacters.splice(0, this._filterIdCharacters.length);
        }

        get bookData() {
            return this._bookData;
        }

        set orderSorting(value) {
            _orderSort = value;
        }

        get orderSorting() {
            return _orderSort;
        }
    }
})();

