import service from 'server/service/sheetservice';
import AuthenticationError from 'server/util/authenticationerror';

/**
 * Route factory create function. Adds routes to server object
 * @param  {Server} server express server instance
 * @param {Object} logger A logger instance
 */
export default (server, logger) => {

    // GET SHEET
    server.get('/sheet/:id', (req, res, next) => {
        const {id} = req.params;

        logger.info(`Requested a resource with id ${id}`);

        service.get(id)
            .then(sheet => {
                res.json({ sheet });
            })
            .catch(err => {
                logger.error(`Fetching of sheet (id: ${id}) failed with error ${err}`);
                next(err);
            });
    });

    // ADD SHEET
    server.post('/sheet', (req, res, next) => {
        const {sheet} = req.body;

        logger.info('Adding resource', sheet);

        service.add(sheet)
            .then(savedSheet => {
                logger.info(`Saved new sheet with id ${savedSheet.id}`);
                res.json({ sheet: savedSheet });
            })
            .catch(err => {
                logger.error(`Add (id: ${sheet.id}) failed with error ${err}`);
                next(err);
            });
    });

    // UPDATE SHEET
    server.put('/sheet/:id', (req, res, next) => {
        const {id} = req.params;
        const {sheet} = req.body;

        // check that the sheet is found in the database
        service.get(id)
            .then(() => {
                service.update(sheet)
                    .then(savedSheet => {
                        logger.info(`Updated sheet with id ${id}`);
                        res.json({ sheet: savedSheet });
                    })
                    .catch(err => {
                        logger.error(`Update (id: ${id}) failed with error: ${err}`);
                        next(err);
                    });
            })
            .catch(next);
    });

    // DELETE SHEET
    server.delete('/sheet/:id', (req, res, next) => {
        const {id} = req.params;
        const adminKey = req.header('X-Admin-Token');

        service.get(id)
            .then(sheet => {
                // admin token delivered in header should match the one saved to the db
                if (!adminKey || adminKey !== sheet.adminKey) {
                    logger.error(`Admin token validation failed: X-Admin-Token ${adminKey} did not match ${sheet.adminKey}!`);
                    return next(new AuthenticationError());
                }

                service.delete(sheet)
                    .then(() => res.json({ id }))
                    .catch(err => {
                        logger.error(`Delete (id: ${id}) failed with error: ${err}`);
                        next(err);
                    });
            })
            .catch(next);
    });
};