import Q from 'kew';
import UnprocessableEntityError from 'server/util/unprocessableentityerror';
import {connection} from 'server/database/dbconnector';
import {validate} from 'common/validation/sheetvalidator';

/**
 * Validate sheet
 * @private
 * @param  {Object} sheet
 * @return {UnprocessableEntityError|undefined}
 */
const validateSheet = (sheet) => {
    const errors = validate(sheet);

    if (Object.keys(errors).length) {
        return new UnprocessableEntityError(`Validation failed: Sheet ${sheet.id}, errors: ${JSON.stringify(errors)}`);
    }
};


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

        connection.get(sheetId, q.makeNodeResolver());

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
        const addObject = Object.assign(sheet, {
            lastSavedOn: new Date().toISOString()
        });

        const validationError = validateSheet(sheet);

        if (validationError) {
            q.reject(validationError);
            return q.promise;
        }

        connection.insert(addObject, addObject.id, err => {
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
        const updateObject = Object.assign(sheet, {
            lastSavedOn: new Date().toISOString()
        });

        const validationError = validateSheet(sheet);

        if (validationError) {
            q.reject(validationError);
            return q.promise;
        }

        connection.insert(updateObject, err => {
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

        connection.destroy(sheet._id, sheet._rev, q.makeNodeResolver());

        return q.promise;
    }
};

export default SheetService;
