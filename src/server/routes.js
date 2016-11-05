import service from 'server/service/sheetservice.js';

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
            .fail(err => {
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
            .fail(err => {
                console.log('Add failed!', err);
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
                    .fail(err => {
                        logger.error(`Update (id: ${id}) failed with error: ${err}`);
                        next(err);
                    });
            })
            .fail(next);
    });

    // DELETE SHEET
    server.delete('/sheet/:id', (req, res, next) => {
        const {id} = req.params;

        service.get(id)
            .then(sheet => {
                service.delete(sheet)
                    .then(() => res.json({ id }))
                    .fail(err => {
                        logger.error(`Delete (id: ${id}) failed with error: ${err}`);
                        next(err);
                    });
            })
            .fail(next);
    });
};