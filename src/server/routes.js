import restify from 'restify';
import service from 'server/service/sheetservice.js';
import {tpl, setLanguage} from 'common/dictionary/dictionary';

const readAndSetTranslationLanguage = (req) => {
    const lang = req.header('Accept-Language');

    if (lang) setLanguage(lang);
};

/**
 * Route factory create function. Adds routes to server object
 * @param  {Server} server restify server instance
 * @return {undefined}
 */
export default (server) => {

    // GET SHEET
    server.get('/sheet/:id', (req, res, next) => {
        const {id} = req.params;

        readAndSetTranslationLanguage(req);

        server.log.info(`Requested a resource with id ${id}`);

        service.get(id)
            .then(sheet => {
                res.send(200, { sheet });
                next();
            })
            .fail(err => {
                if (err.statusCode == 404) {
                    server.log.warn(`Sheet ${id} was not found!`);
                    return next(new restify.ResourceNotFoundError(tpl('error.server.sheet_not_found', { id })));
                }

                server.log.error(`Fetching of sheet (id: ${id}) failed with error:`, err);

                next(err);
            });
    });

    // ADD SHEET
    server.post('/sheet', (req, res, next) => {
        const {sheet} = req.body;

        readAndSetTranslationLanguage(req);

        server.log.info('Adding resource', sheet);

        service.add(sheet)
            .then(savedSheet => {
                server.log.info(`Saved new sheet with id ${savedSheet.id}`);
                res.send(200, { sheet: savedSheet });
                next();
            })
            .fail(err => {
                server.log.error(`Add failed with error ${err}`);
                next(err);
            });
    });

    // UPDATE SHEET
    server.put('/sheet/:id', (req, res, next) => {
        const {id} = req.params;
        const {sheet} = req.body;
        const onError = err => {
            server.log.error(`Update failed with id ${id}. Error: ${err}`);

            if (err.statusCode === 404) {
                return next(new restify.ResourceNotFoundError(tpl('error.server.sheet_not_found', { id })));
            }

            next(err);
        };

        readAndSetTranslationLanguage(req);

        // check that the sheet is found in the database
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

        readAndSetTranslationLanguage(req);

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
                if (err.statusCode === 404) return next(new restify.ResourceNotFoundError(tpl('error.server.sheet_not_found', { id })));
                next(err);
            });
    });
};