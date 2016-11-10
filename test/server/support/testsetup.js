var chai = require('chai');
var sinonChai = require('sinon-chai');
var chaiHttp = require('chai-http');
require('sinon-as-promised');

chai.use(sinonChai);
chai.use(chaiHttp);

