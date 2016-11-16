
/**
 * Find entity from an array based on it's id
 * @param  {Array} haystack
 * @return {Function}
 */
const findFrom = (haystack) => {
    /**
     * Find based on id
     * @param  {string} id
     * @return {Object}
     */
    return id => haystack.find(h => h.id == id);
};

/**
 * Merge two arrays marking removed entities with removed:true
 * @param  {Array} oldArr
 * @param  {Array} newArr
 * @return {Array}
 */
const mergeArrays = (original, merged) => {
    const t = [...original];
    const findFromOldArr = findFrom(original);

    for (let i in merged) {
        const entry = merged[i];
        const ogEntry = findFromOldArr(entry.id);

        // new entity added
        if (!ogEntry) t.push(entry);
        // entities are not updated so no need to replace the original
        else if (entry.removed) ogEntry.removed = true;
    }

    return t;
};

/**
 * Deep merge two sheets and their expenses and participants
 * @param  {Object} oldSheet
 * @param  {Object} newSheet
 * @return {Object}
 */
export default function mergeSheets(oldSheet, newSheet = {}) {
    const temp = {...oldSheet, ...newSheet};

    for (const key in newSheet) {
        // if expenses/participants
        if (newSheet[key] instanceof Array) {
            temp[key] = mergeArrays(oldSheet[key], newSheet[key]);
        // if settings
        } else if (newSheet[key] instanceof Object) {
            temp[key] = {...oldSheet[key], ...newSheet[key]};
        }
    }

    return temp;
}