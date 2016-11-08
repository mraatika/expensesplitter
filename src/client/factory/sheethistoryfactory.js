/**
 * Create history enry model
 * @param  {Object} sheet
 * @return {Object}
 */
export default function create(sheet) {
    const {id, name, createdOn} = sheet;
    return { id, name, createdOn };
}