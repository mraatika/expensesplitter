import {expect} from 'chai';
import {URLUtils} from 'util/utils';

describe('Utility functions', function () {

    describe('URL utils', function () {
        describe('Getting a sheet id from the url', function () {
            describe('Getting id from url ending with an id', function () {

                it('should find an id containing letters', function () {
                    const id = 'abc';
                    const href = `localhost:80/sheet/${id}`;
                    expect(URLUtils.getCurrentSheetId(href)).to.equal(id);
                });

                it('should find an id containing numbers', function () {
                    const id = 'abc123';
                    const href = `localhost:80/sheet/${id}`;
                    expect(URLUtils.getCurrentSheetId(href)).to.equal(id);
                });

                it('should find an id containing dashes', function () {
                    const id = 'abc-123';
                    const href = `localhost:80/sheet/${id}`;
                    expect(URLUtils.getCurrentSheetId(href)).to.equal(id);
                });

                it('should find an id containing low dashes', function () {
                    const id = 'abc_123';
                    const href = `localhost:80/sheet/${id}`;
                    expect(URLUtils.getCurrentSheetId(href)).to.equal(id);
                });

                it('should not find id containing illegal characters', function () {
                    const id = 'abc.123';
                    const href = `localhost:80/sheet/${id}`;
                    expect(URLUtils.getCurrentSheetId(href)).to.be.null;
                });
            });

            describe('Getting id from url ending with slash', function () {
                it('should find the id containing letters', function () {
                    const id = 'abc';
                    const href = `localhost:80/sheet/${id}/`;
                    expect(URLUtils.getCurrentSheetId(href)).to.equal(id);
                });

                it('should not find id containing illegal characters', function () {
                    const id = 'abc.123';
                    const href = `localhost:80/sheet/${id}/`;
                    expect(URLUtils.getCurrentSheetId(href)).to.be.null;
                });
            });

            describe('Getting id from url ending with slash and a page fragment', function () {
                it('should find the id', function () {
                    const id = 'abc';
                    const href = `localhost:80/sheet/${id}/subpage`;
                    expect(URLUtils.getCurrentSheetId(href)).to.equal(id);
                });

                it('should not find id containing illegal characters', function () {
                    const id = 'abc.123';
                    const href = `localhost:80/sheet/${id}/subpage`;
                    expect(URLUtils.getCurrentSheetId(href)).to.be.null;
                });
            });

            describe('Getting id from url that does not contain an id', function () {
                it('should not find id if the actual id is missing', function () {
                    const href = `localhost:80/sheet/`;
                    expect(URLUtils.getCurrentSheetId(href)).to.be.null;
                });

                it('should not find id if the sheet fragment is missing', function () {
                    const href = `localhost:80/123`;
                    expect(URLUtils.getCurrentSheetId(href)).to.be.null;
                });
            });
        });
    });

    describe('Getting the admin fragment from the url', function () {
        describe('Getting id from url that does not contain an id', function () {
            it('should not find id if the actual id is missing', function () {
                const href = `localhost:80/sheet/admin/`;
                expect(URLUtils.getAdminKey(href)).to.be.null;
            });

            it('should not find id if the sheet fragment is missing', function () {
                const href = `localhost:80/sheet/123`;
                expect(URLUtils.getAdminKey(href)).to.be.null;
            });
        });

        describe('Getting key from url that contains a key', function () {
            it('should find key containing letters', function () {
                const id = 'abc';
                const href = `localhost:80/sheet/123/admin/${id}/`;
                expect(URLUtils.getAdminKey(href)).to.equal(id);
            });

            it('should find key containing numbers', function () {
                const id = 'abc123';
                const href = `localhost:80/sheet/123/admin/${id}`;
                expect(URLUtils.getAdminKey(href)).to.equal(id);
            });

            it('should find key containing dashes', function () {
                const id = 'abc-123';
                const href = `localhost:80/sheet/123/admin/${id}`;
                expect(URLUtils.getAdminKey(href)).to.equal(id);
            });

            it('should find key containing low dashes', function () {
                const id = 'abc_123';
                const href = `localhost:80/sheet/123/admin/${id}`;
                expect(URLUtils.getAdminKey(href)).to.equal(id);
            });

            it('should not find key containing illegal characters', function () {
                const id = 'abc.123';
                const href = `localhost:80/sheet/123/admin/${id}`;
                expect(URLUtils.getAdminKey(href)).to.be.null;
            });
        });
    });

    describe('Forming an url for a subpage', function () {
        it('should form a page with a sheet id', function () {
            const subpage = '/subpage';
            const href = `/sheet/123`;

            expect(URLUtils.formSubpageURLFromLocation(subpage, href)).to.equal(href + subpage);
        });

        it('should form a page with a admin key', function () {
            const subpage = '/subpage';
            const href = `/sheet/123/admin/123`;

            expect(URLUtils.formSubpageURLFromLocation(subpage, href)).to.equal(href + subpage);
        });
    });
});