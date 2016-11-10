import UnprocessableEntityError from 'server/util/unprocessableentityerror';
import {connect} from 'server/database/dbconnector';
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
export default class SheetService {

    constructor() {
        this.connection = connect();
    }

    /**
     * Get a sheet from db by sheet id
     * @async
     * @param  {string} sheetId
     * @return {Promise}
     */
    get(sheetId) {
        return new Promise((resolve, reject) => {
            this.connection.get(sheetId, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    /**
     * Add a sheet to the db
     * @async
     * @param {Object} sheet
     * @return {Promise}
     */
    add(sheet) {
        const addObject = Object.assign(sheet, {
            lastSavedOn: new Date().toISOString()
        });

        return new Promise((resolve, reject) => {
            const validationError = validateSheet(sheet);

            if (validationError) return reject(validationError);

            this.connection.insert(addObject, addObject.id, err => {
                if (err) return reject(err);

                this.get(addObject.id)
                    .then(savedSheet => resolve(savedSheet))
                    .catch(err => reject(err));
            });
        });
    }

    /**
     * Update an existing sheet in the db
     * @async
     * @param  {Object} sheet
     * @return {Promise}
     */
    update(sheet) {
        const updateObject = Object.assign(sheet, {
            lastSavedOn: new Date().toISOString()
        });

        return new Promise((resolve, reject) => {
            const validationError = validateSheet(sheet);

            if (validationError) return reject(validationError);

            this.get(sheet.id)
                .then(savedSheet => {
                    // update revision to overwrite any changes and ignore conflicts
                    updateObject._rev = savedSheet._rev;

                    this.connection.insert(updateObject, err => {
                        // reject if error is not 409 (conflict)
                        if (err) return reject(err);
                        resolve(updateObject);
                    });

                })
                .catch(err => reject(err));
        });
    }

    /**
     * Delete sheet from database
     * @async
     * @param  {string} sheetId
     * @return {Promise}
     */
    delete(sheet) {
        return new Promise((resolve, reject) => {
            this.connection.destroy(sheet._id, sheet._rev, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }
}
