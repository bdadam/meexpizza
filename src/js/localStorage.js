const LocalStorage = {
    read: (key, defaultValue = '') => {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch(ex) { return defaultValue; }
    },

    readJson: (key, defaultObject = null) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || defaultObject;
        } catch(ex) {
            return defaultObject;
        }
    },

    write: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch(ex) {}
    },

    writeJson: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch(ex) {}
    }
};

module.exports = LocalStorage;
