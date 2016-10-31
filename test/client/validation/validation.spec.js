import _ from 'lodash';
import {expect} from 'chai';
import {t} from 'dictionary/dictionary';
import validation from 'validation/validation';

describe('Validation', function() {
    it('should be defined', function() {
        expect(typeof validation.validate).to.equal('function');
        expect(typeof validation.validateProperty).to.equal('function');
    });

    it('should require a schema', function () {
        expect(function() {
            validation.validate();
        }).to.throw('IllegalArgumentsException: Schema missing!');

        expect(function() {
            validation.validate({});
        }).to.throw('IllegalArgumentsException: Schema missing!');
    });

    describe('common', function() {

        describe('required', function() {
            var schema = { name: { required: true }};
            var subject = { name: void 0 };

            it('should pass if value is truthy (or 0)', function () {
                subject.name = 'John';
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
                subject.name = 1;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
                subject.name = [];
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
                subject.name = function(){};
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
                subject.name = '   ';
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should fail if value is falsy', function () {
                subject.name = null;
                expect(validation.validate(subject, schema).name).to.be.ok;
                subject.name = void 0;
                expect(validation.validate(subject, schema).name).to.be.ok;
                subject.name = '';
                expect(validation.validate(subject, schema).name).to.be.ok;
                subject.name = NaN;
                expect(validation.validate(subject, schema).name).to.be.ok;
            });

            it('should fail if subject doesn\'t have property at all', function () {
                var subject = {};
                expect(validation.validate(subject, schema).name).to.be.ok;
            });

            it('should not fail if a value is not required and is null', function () {
                const schema = { name: { type: 'string', required: false }};
                const subject = { name: null };

                expect(validation.validate(subject, schema).name).to.be.undefined;
            });

            it('should not fail if a value is not required and is undefined', function () {
                const schema = { name: { type: 'string', required: false }};
                const subject = { name: undefined };

                expect(validation.validate(subject, schema).name).to.be.undefined;
            });
        });

        describe('pattern', function() {
            var schema = { name: { pattern: '^[a-z1]+$' }};
            var subject = { name: void 0 };

            it('should pass if pattern matches the value', function () {
                subject.name = 'john1';
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should fail if pattern doesn\'t match the value', function () {
                subject.name = 'john-*1';
                expect(validation.validate(subject, schema).name).to.be.ok;
            });

            it('should take functon as a pattern rule', function () {
                var schema = { name: { pattern: function() { return '^[a-z1]+$'; }}};
                var subject = { name: 'john' };
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });
        });

        describe('translated error messages', function () {
            it('should return translated error message when rule has msgKey property', function () {
                var msgKey = 'error.participant.name';
                var schema = { name: { required : true, type: 'string', msgKey: msgKey }};
                var participant = { name: '' };
                expect(validation.validate(participant, schema).name).to.equal(t(msgKey + '.required'));
                participant.name = 2;
                expect(validation.validate(participant, schema).name).to.equal(t(msgKey + '.type'));
            });
        });
    });

    describe('string', function() {
        describe('type', function() {
            var schema = { name: { type: 'string' } };
            var subject = { name: void 0 };

            it('should accept a valid string', function () {
                subject.name = 'John';
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should not accept a value of different type', function() {
                subject.name = 12;
                expect(validation.validate(subject, schema).name).to.be.ok;
            });

            it('should not accept a value of different (falsy) type', function() {
                subject.name = NaN;
                expect(validation.validate(subject, schema).name).to.be.ok;
            });
        });

        describe('minLength', function() {
            var schema = { name: { minLength: 3 }};
            var subject = { name: void 0 };

            it('should accept if min length requirement is met', function() {
                subject.name = 'abc';
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should not accept if length is less than minimum length', function() {
                subject.name = 'a';
                expect(validation.validate(subject, schema).name).to.be.ok;
            });

            it('should accept if value is not defined', function() {
                subject.name = void 0;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });
        });

        describe('maxLength', function() {
            var schema = { name: { maxLength: 3 }};
            var subject = { name: void 0 };

            it('should accept if value length is less or equal than max length', function() {
                subject.name = 'abc';
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should not accept if length is greater than max length', function() {
                subject.name = 'abcd';
                expect(validation.validate(subject, schema).name).to.be.ok;
            });

            it('should accept if value is not defined', function() {
                subject.name = void 0;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });
        });
    });

    describe('number', function() {

        describe('type:number', function() {
            var schema = { age: { type: 'number' } };
            var subject = { age: void 0 };

            it('should accept a valid number', function () {
                subject.age = 12;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should not accept a value of different type', function() {
                subject.age = 'John';
                expect(validation.validate(subject, schema).age).to.be.ok;
            });
        });

        describe('type:decimal', function () {
            var schema = { average: { type: 'decimal'} };
            var subject = { average: void 0 };

            it('should accept a valid decimal number', function () {
                subject.average = 3.5;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should not accept a value of different type', function () {
                subject.average = 'John';
                expect(validation.validate(subject, schema).average).to.be.ok;
            });
        });

        describe('min', function() {
            var schema = { age: { min: 1 } };
            var subject = { age: void 0 };

            it('should accept if min length requirement is met', function() {
                subject.age = 1;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should not accept if length is less than minimum length', function() {
                subject.age = 0;
                expect(validation.validate(subject, schema).age).to.be.ok;
            });

            it('should accept if value is not defined', function() {
                subject.age = void 0;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });
        });

        describe('max', function() {
            var schema = { age: { max: 1 } };
            var subject = { age: void 0 };

            it('should accept if value is less than max rule', function() {
                subject.age = 0;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;

                subject.age = -1;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should not accept if length is greater than max rule', function() {
                subject.age = 2;
                expect(validation.validate(subject, schema).age).to.be.ok;
            });

            it('should accept if value is not defined', function() {
                subject.age = void 0;
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });
        });
    });

    describe('array', function() {
        describe('type', function() {
            var schema = { languages: { type: 'array' } };
            var subject = { languages: void 0 };

            it('should accept a valid array', function () {
                subject.languages = [];
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should not accept a value of different type', function() {
                subject.languages = 'John';
                expect(validation.validate(subject, schema).languages).to.be.ok;
                subject.languages = {};
                expect(validation.validate(subject, schema).languages).to.be.ok;
            });
        });

        describe('minLength', function() {
            var schema = { languages: { minLength: 2 }};
            var subject = { languages: void 0 };

            it('should accept if min length requirement is met', function() {
                subject.languages = [1,2];
                expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
            });

            it('should not accept if length is less than minimum length', function() {
                subject.languages = [1];
                expect(validation.validate(subject, schema).languages).to.be.ok;
            });
        });
    });

    describe('type:object', function() {
        var schema = { competences: { type: 'object' } };
        var subject = { competences: void 0 };

        it('should accept a valid array', function () {
            subject.competences = {};
            expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
        });

        it('should not accept a value of different type', function() {
            subject.competences = [];
            expect(validation.validate(subject, schema).competences).to.be.ok;
            subject.competences = function() {};
            expect(validation.validate(subject, schema).competences).to.be.ok;
        });
    });

    describe('type:invalid type', function() {
        it('should return void if type is not defined', function() {
            var schema = { age: { type: 'notfoundtype' } };
            var subject = { age: 'asb' };
            expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
        });
    });

    describe('Multiple rules', function() {
        var schema = {
            name: {
                type: 'string',
                minLength: 5,
                pattern: '^[a-z]+$'
            }
        };
        var subject = { name: void 0 };

        it('should pass if all the rules are satisfied', function() {
            subject.name = 'yormuli';
            expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
        });

        it('should return true if any of the rules are not met', function() {
            subject.name = 'yormuli1';
            expect(validation.validate(subject, schema).name).to.be.ok;
        });
    });

    describe('Multiple fields', function() {
        var schema = {
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
        var subject = { name: void 0 };

        it('should pass if all the rules are satisfied', function() {
            subject.name = 'yormuli';
            subject.age = 1;
            subject.languages = [1,2,3];
            expect(_.isEmpty(validation.validate(subject, schema))).to.be.ok;
        });

        it('should return true if any of the rules are not met', function() {
            subject.name = 'yormuli1';
            subject.age = -5;
            subject.languages = [1, 2, 3];

            var result = validation.validate(subject, schema);
            expect(result.name).to.be.ok;
            expect(result.age).to.be.ok;
            expect(result.languages).to.be.undefined;
        });
    });

    describe('Validating a single property', function () {
        var schema = { name: { required: true, maxLength: 5, minLength: 3 }};

        it('should return true when msgKey is not defined and the result is errous', function () {
            expect(validation.validateProperty('name', 'gg', schema)).to.be.ok;
        });

        it('should return undefined when validation is successfull', function () {
            expect(validation.validateProperty('name', 'ggall', schema)).to.equal(void 0);
        });

        it('should return a translated error message if msgKey is defined', function () {
            schema.name.msgKey = 'error.participant.name';
            expect(validation.validateProperty('name', 'ggallin', schema)).to.equal(t(schema.name.msgKey + '.maxLength'));
        });
    });
});