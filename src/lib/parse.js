
/**
 * @param {unknown} data 
 * @returns {any}
 */
export function parseIndexJson(data) {
    // remove illegal data, where json data does not have a title or file
    data = data.filter((item) => {
        if (!item.title || !item.file) {
            console.log('Illegal data in index.json: ', item);
            return false;
    }
    return  true;
        
    });
    return data;
}
