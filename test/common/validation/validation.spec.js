import {expect} from 'chai';
import {t} from 'common/dictionary/dictionary';
import {validate, validateProperty} from 'common/validation/validator';

describe('Validation', function() {
    it('should be defined', function() {
        expect(typeof validate).to.equal('function');
        expect(typeof validateProperty).to.equal('function');
    });

    describe('common', function() {

        describe('required', function() {
            const schema = { name: { required: true }};

            it('should pass if value is truthy (or 0)', function () {
                const subject = { name: 'John' };
                expect(validate(subject, schema)).to.be.empty;
                subject.name = 1;
                expect(validate(subject, schema)).to.be.empty;
                subject.name = [];
                expect(validate(subject, schema)).to.be.empty;
                subject.name = function(){};
                expect(validate(subject, schema)).to.be.empty;
                subject.name = '   ';
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should fail if value is falsy', function () {
                const subject = { name: null };
                subject.name = null;
                expect(validate(subject, schema).name).to.be.ok;
                subject.name = void 0;
                expect(validate(subject, schema).name).to.be.ok;
                subject.name = '';
                expect(validate(subject, schema).name).to.be.ok;
                subject.name = NaN;
                expect(validate(subject, schema).name).to.be.ok;
            });

            it('should fail if subject doesn\'t have property at all', function () {
                const subject = {};
                expect(validate(subject, schema).name).to.be.ok;
            });

            it('should not fail if a value is not required and is null', function () {
                const schema = { name: { type: 'string', required: false }};
                const subject = { name: null };

                expect(validate(subject, schema).name).to.be.undefined;
            });

            it('should not fail if a value is not required and is undefined', function () {
                const schema = { name: { type: 'string', required: false }};
                const subject = { name: undefined };

                expect(validate(subject, schema).name).to.be.undefined;
            });
        });

        describe('pattern', function() {
            const schema = { name: { pattern: '^[a-z1]+$' }};

            it('should pass if pattern matches the value', function () {
                const subject = { name: 'john1' };
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should fail if pattern doesn\'t match the value', function () {
                const subject = { name: 'john-*1' };
                expect(validate(subject, schema).name).to.be.ok;
            });

            it('should take functon as a pattern rule', function () {
                const schema = { name: { pattern: function() { return '^[a-z1]+$'; }}};
                const subject = { name: 'john' };
                expect(validate(subject, schema)).to.be.empty;
            });
        });

        describe('translated error messages', function () {
            it('should return translated error message when rule has msgKey property', function () {
                const msgKey = 'error.participant.name';
                const schema = { name: { required : true, type: 'string', msgKey: msgKey }};
                const participant = { name: '' };
                expect(validate(participant, schema).name).to.equal(t(msgKey + '.required'));
                participant.name = 2;
                expect(validate(participant, schema).name).to.equal(t(msgKey + '.type'));
            });
        });
    });

    describe('string', function() {
        describe('type', function() {
            const schema = { name: { type: 'string', required: true }};

            it('should accept a valid string', function () {
                const subject = { name: 'John' };
                subject.name = 'John';
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should not accept a value of different type', function() {
                const subject = { name: 12 };
                expect(validate(subject, schema).name).to.be.ok;
            });

            it('should not accept a value of different (falsy) type', function() {
                const subject = { name: NaN };
                expect(validate(subject, schema).name).to.be.ok;
            });

            it('should not accept missing value if required', function () {
                const subject = { name: undefined };
                expect(validate(subject, schema).name).to.be.ok;
            });

            it('should accept missing value if not required', function () {
                const subject = { name: undefined };
                const schema = { name: { type: 'string', required: false }};
                expect(validate(subject, schema).name).to.be.undefined;
            });
        });

        describe('minLength', function() {
            const schema = { name: { minLength: 3, required: true }};

            it('should accept if min length requirement is met', function() {
                const subject = { name: 'abc' };
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should not accept if length is less than minimum length', function() {
                const subject = { name: 'a' };
                expect(validate(subject, schema).name).to.be.ok;
            });

            it('should accept if value is not defined', function() {
                const subject = { name: undefined };
                const schema = { name: { minLength: 3, required: false }};
                expect(validate(subject, schema)).to.be.empty;
            });
        });

        describe('maxLength', function() {
            const schema = { name: { maxLength: 3 }};

            it('should accept if value length is less or equal than max length', function() {
                const subject = { name: 'abc' };
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should not accept if length is greater than max length', function() {
                const subject = { name: 'abcd' };
                expect(validate(subject, schema).name).to.be.ok;
            });

            it('should accept if value is not defined', function() {
                const subject = { name: undefined };
                expect(validate(subject, schema)).to.be.empty;
            });
        });
    });

    describe('number', function() {

        describe('type:number', function() {
            const schema = { age: { type: 'number' } };

            it('should accept a valid number', function () {
                const subject = { age: 12 };
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should not accept a value of different type', function() {
                const subject = { age: 'John' };
                expect(validate(subject, schema).age).to.be.ok;
            });
        });

        describe('type:decimal', function () {
            const schema = { average: { type: 'decimal'} };

            it('should accept a valid decimal number', function () {
                const subject = { average: 3.5 };
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should not accept a value of different type', function () {
                const subject = { average: 'John' };
                expect(validate(subject, schema).average).to.be.ok;
            });

            it('should convert commas to dots', function () {
                const subject = { average: '3,5' };
                expect(validate(subject, schema).average).to.be.undefined;
            });
        });

        describe('min', function() {
            const schema = { age: { min: 1, required: true }};

            it('should accept if min length requirement is met', function() {
                const subject = { age: 1 };
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should not accept if length is less than minimum length', function() {
                const subject = { age: 0 };
                expect(validate(subject, schema).age).to.be.ok;
            });

            it('should accept if value is not defined', function() {
                const subject = { age: undefined };
                const schema = { age: { min: 1, required: false }};
                expect(validate(subject, schema)).to.be.empty;
            });
        });

        describe('max', function() {
            const schema = { age: { max: 1 } };

            it('should accept if value is less than max rule', function() {
                const subject = { age: 0 };
                expect(validate(subject, schema)).to.be.empty;

                const subject2 = { age: -1 };
                expect(validate(subject2, schema)).to.be.empty;
            });

            it('should not accept if length is greater than max rule', function() {
                const subject = { age: 2 };
                expect(validate(subject, schema).age).to.be.ok;
            });

            it('should accept if value is not defined', function() {
                const subject = { age: undefined };
                expect(validate(subject, schema)).to.be.empty;
            });
        });
    });

    describe('array', function() {
        describe('type', function() {
            const schema = { languages: { type: 'array' } };

            it('should accept a valid array', function () {
                const subject = { languages: [] };
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should not accept a value of different type', function() {
                const subject = { languages: 'John' };
                expect(validate(subject, schema).languages).to.be.ok;
            });

            it('should not accept object as an array', function () {
                const subject = { languages: {} };
                expect(validate(subject, schema).languages).to.be.ok;
            });
        });

        describe('minLength', function() {
            const schema = { languages: { minLength: 2 }};

            it('should accept if min length requirement is met', function() {
                const subject = { languages: [1, 2] };
                expect(validate(subject, schema)).to.be.empty;
            });

            it('should not accept if length is less than minimum length', function() {
                const subject = { languages: [1] };
                expect(validate(subject, schema).languages).to.be.ok;
            });
        });
    });

    describe('type:object', function() {
        const schema = { competences: { type: 'object' } };

        it('should accept a valid array', function () {
            const subject = { competences: {} };
            expect(validate(subject, schema)).to.be.empty;
        });

        it('should not accept a value of different type', function() {
            const subject = { competences: [] };
            expect(validate(subject, schema).competences).to.be.ok;
        });

        it('should not accept function as object', function () {
            const subject = { competences: function() {} };
            expect(validate(subject, schema).competences).to.be.ok;
        });
    });

    describe('type:invalid type', function() {
        it('should return void if type is not defined', function() {
            const schema = { age: { type: 'notfoundtype' } };
            const subject = { age: 'asb' };
            expect(validate(subject, schema)).to.be.empty;
        });
    });

    describe('Multiple rules', function() {
        const schema = {
            name: {
                type: 'string',
                minLength: 5,
                pattern: '^[a-z]+$'
            }
        };

        it('should pass if all the rules are satisfied', function() {
            const subject = { name: 'yormuli' };
            expect(validate(subject, schema)).to.be.empty;
        });

        it('should return true if any of the rules are not met', function() {
            const subject = { name: 'yormuli1' };
            expect(validate(subject, schema).name).to.be.ok;
        });
    });

    describe('Multiple fields', function() {
        const schema = {
            name: {
                type: 'string',
                minLength: 5,
                pattern: '^[a-z]+$'
            },
            age: {
                type: 'number',
                min: 0
            },
            languages: {
                type: 'array',
                minLength: 2
            }
        };

        it('should pass if all the rules are satisfied', function() {
            const subject = {
                name: 'yormuli',
                age: 1,
                languages: [1,2,3]
            };

            expect(validate(subject, schema)).to.be.empty;
        });

        it('should return true if any of the rules are not met', function() {
            const subject = {
                name: 'yormuli1',
                age: -5,
                languages: [1,2,3]
            };

            const result = validate(subject, schema);
            expect(result).to.include.keys(['name', 'age']);
            expect(result).not.to.include.keys('languages');
        });
    });

    describe('Validating a single property', function () {
        const schema = {
            name: {
                required: true,
                maxLength: 5,
                minLength: 3
            }
        };

        it('should return true when msgKey is not defined and the result is errous', function () {
            expect(validateProperty('name', 'gg', schema)).to.be.ok;
        });

        it('should return undefined when validation is successfull', function () {
            expect(validateProperty('name', 'ggall', schema)).to.be.undefined;
        });

        it('should return a translated error message if msgKey is defined', function () {
            const schema = {
                name: {
                    type: 'string',
                    maxLength: 5,
                    msgKey: 'error.participant.name'
                }
            };

            const expected = t(schema.name.msgKey + '.maxLength');
            const result = validateProperty('name', 'ggallin', schema);

            expect(result).to.equal(expected);
        });

        it('should pass if value is not required and empty', function () {
            const schema = {
                optional: {
                    type: 'string',
                    required: false
                }
            };

            const subject = { optional: null };

            expect(validateProperty('optional', subject.optional, schema)).to.be.undefined;

        });

        it('should pass if value is not required and empty', function () {
            const schema = {
                nonOptional: {
                    type: 'string',
                    required: true
                }
            };

            const subject = { nonOptional: null };

            expect(validateProperty('nonOptional', subject.optional, schema)).to.be.ok;
        });
    });
});