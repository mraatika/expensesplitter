import Q from 'kew';
import dbConnector from 'server/common/dbconnector';
import validation from 'client/validation/validation';

/**
 * Service for handling sheets
 * @type {Object}
 */
const SheetService = {

    /**
     * Get a sheet from db by sheet id
     * @async
     * @param  {string} sheetId
     * @return {Q.promise}
     */
    get: sheetId => {
        const q = Q.defer();
        const db = dbConnector.getDbConnection();

        db.get(sheetId, q.makeNodeResolver());

        return q.promise;
    },

    /**
     * Add a sheet to the db
     * @async
     * @param {Object} sheet
     * @return {Q.promise}
     */
    add: sheet => {
        const q = Q.defer();
        const db = dbConnector.getDbConnection();
        const addObject = Object.assign(sheet, {
            lastSavedOn: new Date().toISOString()
        });

        db.insert(addObject, addObject.id, err => {
            if (err) return q.reject(err);

            SheetService.get(addObject.id)
                .then(savedSheet => q.resolve(savedSheet))
                .fail(err => q.resolve(err));
        });

        return q.promise;
    },

    /**
     * Update an existing sheet in the db
     * @async
     * @param  {Object} sheet
     * @param  {Promise} [q] Used if called recursively
     * @return {Q.promise}
     */
    update: (sheet, q = Q.defer()) => {
        const db = dbConnector.getDbConnection();
        const updateObject = Object.assign(sheet, {
            lastSavedOn: new Date().toISOString()
        });

        db.insert(updateObject, err => {
            // reject if error is not 409 (conflict)
            if (err && err.statusCode != 409) { return q.reject(err); }

            // get changed sheet
            SheetService.get(sheet.id)
                .then(savedSheet => {
                    // if ok then resolve with the sheet
                    if (!err) { return q.resolve(savedSheet); }
                    // in case there was a conflict then
                    // update _rev and try again
                    updateObject._rev = savedSheet._rev;
                    SheetService.update(updateObject, q);
                })
                .fail(err => q.reject(err));
        });

        return q.promise;
    },

    /**
     * Delete sheet from database
     * @async
     * @param  {string} sheetId
     * @return {Q.promise}
     */
    delete: sheet => {
        const q = Q.defer();
        const db = dbConnector.getDbConnection();

        db.destroy(sheet._id, sheet._rev, q.makeNodeResolver());

        return q.promise;
    }
};

export default SheetService;
