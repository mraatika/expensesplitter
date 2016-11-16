import {expect} from 'chai';
import mergeSheets from 'server/util/mergesheets';

describe('Util: MergeSheets', function () {

    describe('Simple merge', function () {
        it('should return first object if second is missing', function () {
            const obj = { a: 1 };
            expect(mergeSheets(obj)).to.deep.equal(obj);
        });

        it('should merge two objects', function () {
            const obj1 = { a: 1 };
            const obj2 = { b: 1 };

            expect(mergeSheets(obj1, obj2)).to.deep.equal({...obj1, ...obj2 });
        });

        it('should overwrite existing props', function () {
            const obj1 = { a: 1 };
            const obj2 = { a: 2 };

            expect(mergeSheets(obj1, obj2).a).to.equal(obj2.a);
        });
    });

    describe('Merge nested objects', function () {
        it('should deep merge objects', function () {
            const obj1 = { a: { a: 1 } };
            const obj2 = { a: { b: 2 } };

            expect(mergeSheets(obj1, obj2).a.a).to.equal(obj1.a.a);
            expect(mergeSheets(obj1, obj2).a.b).to.equal(obj2.a.b);
        });

        it('should deep merge and overwrite existing props', function () {
            const obj1 = { a: { a: 1 } };
            const obj2 = { a: { a: 2 } };

            expect(mergeSheets(obj1, obj2).a.a).to.equal(obj2.a.a);
        });

        it('should deep merge multiple objects', function () {
            const obj1 = { a: { a: 1 }, b: { b: 1 }};
            const obj2 = { a: { a: 2 }, b: { c: 2 }};

            const res = mergeSheets(obj1, obj2);

            expect(res.a.a).to.equal(obj2.a.a);
            expect(res.b.b).to.equal(obj1.b.b);
            expect(res.b.c).to.equal(obj2.b.c);
        });
    });

    describe('Merge nested arrays', function () {
        it('should merge arrays', function () {
            const obj1 = { a: [{ id: 1 }] };
            const obj2 = { a: [{ id: 2 }] };

            expect(mergeSheets(obj1, obj2).a).to.have.lengthOf(2);
        });

        it('should overwrite existing array entities by id', function () {
            const obj1 = { a: [{ id: 1 }] };
            const obj2 = { a: [{ id: 1 }] };

            expect(mergeSheets(obj1, obj2).a).to.have.lengthOf(1);
        });

        it('should merge multiple arrays', function () {
            const obj1 = { a: [{ id: 1 }], b: [{ id: 3 }] };
            const obj2 = { a: [{ id: 2 }], b: [{ id: 4 }] };

            const res = mergeSheets(obj1, obj2);

            expect(res.a).to.have.lengthOf(2);
            expect(res.b).to.have.lengthOf(2);
        });
    });

    describe('Merge nested objects and arrays', function () {
        it('should merge multiple arrays', function () {
            const obj1 = { a: [{ id: 1 }], b: [{ id: 3 }], c: { d: 1 }};
            const obj2 = { a: [{ id: 2 }], b: [{ id: 4 }], c: { e: 2 } };

            const res = mergeSheets(obj1, obj2);

            expect(res.a).to.have.lengthOf(2);
            expect(res.b).to.have.lengthOf(2);
            expect(res.c.d).to.equal(obj1.c.d);
            expect(res.c.e).to.equal(obj2.c.e);
        });
    });

    describe('Merge removed entities', function () {
        it('should mark entity removed', function () {
            const obj1 = { a: [{ id: 1 }] };
            const obj2 = { a: [{ id: 1, removed: true }] };

            expect(mergeSheets(obj1, obj2).a).to.have.lengthOf(1);
            expect(mergeSheets(obj1, obj2).a[0].removed).to.be.ok;
        });

        it('should keep entity removed even if new entry is not', function () {
            const obj1 = { a: [{ id: 1, removed: true }] };
            const obj2 = { a: [{ id: 1 }] };

            expect(mergeSheets(obj1, obj2).a).to.have.lengthOf(1);
            expect(mergeSheets(obj1, obj2).a[0].removed).to.be.ok;
        });
    });
});