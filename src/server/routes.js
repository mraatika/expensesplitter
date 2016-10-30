import restify from 'restify';
import service from 'server/service/sheetservice.js';

/**
 * Route factory create function. Adds routes to server object
 * @param  {Server} server restify server instance
 * @return {undefined}
 */
export default (server) => {

    // GET SHEET
    server.get('/sheet/:id', (req, res, next) => {
        const {id} = req.params;

        server.log.info(`Requested a resource with id ${id}`);

        service.get(id)
            .then(sheet => {
                res.send(200, { sheet });
                next();
            })
            .fail(err => {
                if (err.statusCode == 404) {
                    server.log.error(`Resource not found with id ${id}`);
                    return next(new restify.ResourceNotFoundError(`Resource not found with id ${id}`));
                }
                server.log.error(`Resource get failed with id ${id} Error:`, err);
                next(new restify.InternalServerError(err));
            });
    });

    // ADD SHEET
    server.post('/sheet', (req, res, next) => {
        const {sheet} = req.body;

        server.log.info('Adding resource', sheet);

        service.add(sheet)
            .then(savedSheet => {
                server.log.info(`Added sheet with id ${savedSheet.id}`);
                res.send(200, { sheet: savedSheet });
                next();
            })
            .fail(err => {
                server.log.error('Add failed, Error:', err);
                next(err);
            });
    });

    // UPDATE SHEET
    server.put('/sheet/:id', (req, res, next) => {
        const {id} = req.params;
        const {sheet} = req.body;
        const onError = err => {
            server.log.error(`Update failed with id ${id}. Error:`, err);
            next(err);
        };

        service.get(id)
            .then(() => {
                service.update(sheet)
                    .then(savedSheet => {
                        server.log.info(`Updated sheet with id ${id}`);
                        res.send(200, { sheet: savedSheet });
                    })
                    .fail(onError);
            })
            .fail(onError);
    });

    // DELETE SHEET
    server.del('/sheet/:id', (req, res, next) => {
        const {id} = req.params;

        service.get(id)
            .then(sheet => {
                service.delete(sheet)
                    .then(() => {
                        res.send(200, { id });
                        next();
                    })
                    .fail(err => {
                        next(new restify.InternalServerError(err));
                    });
            })
            .fail(err => {
                if (err.statusCode === 404) return next(new restify.ResourceNotFoundError(err));
                next(new restify.InternalServerError(err));
            });
    });
};