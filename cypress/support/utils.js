const path = require('path');

export const validateTextFile = (fileName, content) => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    const downloadedFilename = path.join(downloadsFolder, `${fileName}.txt`);

    cy.readFile(downloadedFilename).should((text) => {
        // validate the downloaded ${fileName}.txt file
        // const lines = text.split('\n')
        // expect(lines).to.have.length.gt(2)
        expect(text).to.contains(content);
    });
}

export function getCurrentDateFormatted(format, period, utc) {
    period = typeof period !== "undefined" ? period : "today";
    utc = typeof utc !== "undefined" ? utc : 0;
    const validPeriods = ["today", "month", "year"];
    if (!validPeriods.includes(period.toLowerCase())) {
        throw new Error("Invalid period. Please provide 'today', 'month', or 'year' only.");
    }
    // Change it to UTC+2
    const currentDate = new Date(new Date().getTime() + (utc * 60 * 60 * 1000));
    const year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

    if (period.toLowerCase() === "month") day = "01";
    if (period.toLowerCase() === "year") {
        day = "01";
        month = "01";
    }
    let formattedDate = format.toLowerCase();
    formattedDate = formattedDate.replace('yyyy', year);
    formattedDate = formattedDate.replace('mm', month);
    formattedDate = formattedDate.replace('dd', day);
    formattedDate = formattedDate.replace('hh', hours);
    formattedDate = formattedDate.replace('mm', minutes);
    formattedDate = formattedDate.replace('ss', seconds);
    formattedDate = formattedDate.replace('sss', milliseconds);

    return formattedDate;
}

export function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const time = hours.toString().concat(":", formattedMinutes.toString());
    return time;
}

export function getCurrentYear() {
    var d = new Date(),
        year = d.getFullYear();
    return year;
}

export function reverseString(str) {
    return (str === '') ? '' : reverseString(str.substring(1)) + str.charAt(0);
}

export function reverseDateFormat(str, separator) {
    separator = separator || "/";
    let stringArray = str.split("-").reverse();
    return stringArray.join(separator);
    // return stringArray[2] + "/" + stringArray[1] + "/" + stringArray[0]
}

export function removeAllSpace(str) {
    let stringArray = str.split(" ");
    return stringArray.join("");
}

/** 
 * @param {Object} obj  a object to filter 
 * @param {*} condition to check
 * @returns newObject with meet the condition
 * e,g: let notEmptyObject = filterObject( {key: "", key2: "not null", key3: "empty"}, value => value !== "");
 */
export function filterObject(obj, condition) {
    return Object.keys(obj)
        .filter(key => condition(obj[key]))
        .reduce((newObj, key) => {
            newObj[key] = obj[key];
            return newObj;
        }, {});
}

export function formatAmountToString(amount) {
    let dollarUSLocale = Intl.NumberFormat('en-US', {
        // style: 'currency',
        // currency: 'USD',
        minimumFractionDigits: 2,
        // maximumFractionDigits: 1,
    }); //Format: 1,000,000.00
    return dollarUSLocale.format(amount).toString();
}

export function substringToLastIndex(str, startIndex, matchCharacter) {
    const lastIndex = str.lastIndexOf(matchCharacter);
    if (lastIndex !== -1 && lastIndex >= startIndex) {
        return str.substring(startIndex, lastIndex);
    }
    return "";
}

export function findIndexContaining(arr, searchString) {
    return arr.findIndex(value => value.includes(searchString));
}

export function generateRandomNumber(from = 0, to = 5) {
    return Math.floor(Math.random(to - from) * to);
}

export function changeDateFormatFromAPI(format, date) {
    // The returned date from API has YYYY-MM-DD format
    let splittedDate = date.split("-");
    const year = splittedDate[0];
    const month = splittedDate[1];
    const day = splittedDate[2];
    let formattedDate = format;
    formattedDate = formattedDate.replace('YYYY', year);
    formattedDate = formattedDate.replace('MM', month);
    formattedDate = formattedDate.replace('DD', day);
    return formattedDate
}

export function replaceCharsInArray(arr, charToReplace, replacementChar) {
    return arr.map(value => value.replace(new RegExp(charToReplace, 'g'), replacementChar));
}

/**
 * npm_lifecycle_script = "configFile=noriaStaging,testType=Regression,feature=All" convert the text to an Object 
 * @param {String} str 
 * @returns an Object with {"configFile":"noriaStaging","feature":"All", "testType":"Regression}
 */
export function createObjectFromString(str) {
    const keyValuePairs = str.split(",");
    const obj = {};
    keyValuePairs.forEach(pair => {
        const [key, value] = pair.split("=");
        obj[key] = value;
    });
    return obj;
}

export function getValueByKey(obj, key) {
    return obj[key] || "noValue";
}

/**
 * 
 * @param {*} arrayOfObject 
 * @param {*} codeToFind 
 * @returns String value of the translation or description
 * @data
 * const dataArray = [
        {
            "code": "  1",
            "description": "Hull",
            "translation": "Hull",
        },
        {
            "code": "  2",
            "description": "HULL INT",
            "translation": "Hull interest",
        }, // Other array items...
    ];
 */
export function getValueFromInterestList(arrayOfObject, codeToFind) {
    for (let i = 0; i < arrayOfObject.length; i++) {
        let item = arrayOfObject[i];
        if (item.code.trim() === codeToFind.trim()) {
            return item.translation !== null ? item.translation : item.description;
        }
    }
    return null; // Return null if code is not found
}

/**
 * 
 * @param {*} arrayOfObject 
 * @param {*} keyToFind 
 * @param {*} valueToFind 
 * @param {*} keyToGetValue 
 * @returns keyToGetValue - String value of the translation or description
 * @data
 * const dataArray = [
        {
            "code": "  1",
            "description": "Hull",
        },
        {
            "code": "  2",
            "description": "HULL INT",
        }, // Other array items...
    ];
 */
export function getValueFromArrayOfObject(arrayOfObject, keyToFind, valueToFind, keyToGetValue) {
    for (let i = 0; i < arrayOfObject.length; i++) {
        let item = arrayOfObject[i];
        if (typeof valueToFind === "number") {
            if (item[keyToFind] === valueToFind) {
                return item[keyToGetValue];
            }

        } else {
            if (item[keyToFind].trim() === valueToFind) {
                return item[keyToGetValue];
            }
        }
    }
    return null; // Return null if code is not found
}

export function getRandomDateBetween(startDate, endDate) {
    const dates = []
    let currentDate = startDate
    const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }
    while (currentDate <= endDate) {
        dates.push(currentDate)
        currentDate = addDays.call(currentDate, 1)
    }
    let randomIndex = generateRandomNumber(1, dates.length);
    let date = dates[randomIndex];
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    let dateBefore = dates[randomIndex - 1];
    let yearBefore = dateBefore.getFullYear();
    let monthBefore = String(dateBefore.getMonth() + 1).padStart(2, '0');
    let dayBefore = String(dateBefore.getDate()).padStart(2, '0');

    return [`${dayBefore}/${monthBefore}/${yearBefore}`, `${day}/${month}/${year}`];
}

export function isArraySortedAscending(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (Number(arr[i]) > Number(arr[i + 1])) {
            return false;
        }
    }
    return true;
}

export function isArraySortedDescending(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (Number(arr[i]) < Number(arr[i + 1])) {
            return false;
        }
    }
    return true;
}

// Check the element is scrollable by vertically
export function getScrollableStatus(element) {
    const styles = window.getComputedStyle(element);
    const isVerticallyScrollable =
        element.scrollHeight > element.clientHeight &&
        styles['overflow-y'] !== 'hidden';
    if (isVerticallyScrollable) {
        return true;
    } else {
        return false;
    }
}