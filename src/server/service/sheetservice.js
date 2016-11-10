import UnprocessableEntityError from 'server/util/unprocessableentityerror';
import dbConnector from 'server/util/dbconnector';
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
     * @return {Promise}
     */
    get: sheetId => {
        const db = dbConnector.getDbConnection();

        return new Promise((resolve, reject) => {
            db.get(sheetId, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    },

    /**
     * Add a sheet to the db
     * @async
     * @param {Object} sheet
     * @return {Promise}
     */
    add: sheet => {
        const db = dbConnector.getDbConnection();
        const addObject = Object.assign(sheet, {
            lastSavedOn: new Date().toISOString()
        });

        return new Promise((resolve, reject) => {
            const validationError = validateSheet(sheet);

            if (validationError) return reject(validationError);

            db.insert(addObject, addObject.id, err => {
                if (err) return reject(err);

                SheetService.get(addObject.id)
                    .then(savedSheet => resolve(savedSheet))
                    .catch(err => reject(err));
            });
        });
    },

    /**
     * Update an existing sheet in the db
     * @async
     * @param  {Object} sheet
     * @return {Promise}
     */
    update: (sheet) => {
        const db = dbConnector.getDbConnection();
        const updateObject = Object.assign(sheet, {
            lastSavedOn: new Date().toISOString()
        });

        return new Promise((resolve, reject) => {
            const validationError = validateSheet(sheet);

            if (validationError) return reject(validationError);

            SheetService.get(sheet.id)
                .then(savedSheet => {
                    // update revision to overwrite any changes and ignore conflicts
                    updateObject._rev = savedSheet._rev;

                    db.insert(updateObject, err => {
                        // reject if error is not 409 (conflict)
                        if (err) return reject(err);
                        resolve(updateObject);
                    });
                })
                .catch(err => reject(err));

        });
    },

    /**
     * Delete sheet from database
     * @async
     * @param  {string} sheetId
     * @return {Promise}
     */
    delete: sheet => {
        const db = dbConnector.getDbConnection();

        return new Promise((resolve, reject) => {
            db.destroy(sheet._id, sheet._rev, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
};

export default SheetService;
