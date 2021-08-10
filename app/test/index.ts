import { config } from '../config';

// Require dependencies
import mocha from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

import { app } from '../app';
const should = chai.should();

chai.use(chaiHttp);

const payload = [
    {
        "source": "I am Arwen - I've come to help you",
        "target": "Ich bin Arwen - Ich bin gekommen, um dir zu helfen",
        "sourceLanguage": "en",
        "targetLanguage": "de"
    },
    {
        "source": "Come back to the light",
        "target": "Komm zurück zum Licht",
        "sourceLanguage": "en",
        "targetLanguage": "de"
    }
]

//TStore translations

describe('/Add translations data', () => {
    it('should add strore translation data', (done: any) => {
        chai.request(app)
            .post('/store_translation')
            .send(payload)
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('message').eql("translation saved successfully");
                res.body.should.have.property('code').eql(200);
                res.body.should.have.property('error').eql(false);
                done();
            });
    });
});

describe('Errors', () => {
    // Validation errors
    it('should fail of wrong data input of source', (done: any) => {
        chai.request(app)
            .post('/store_translation')
            .send([{
                "sourc": "I am Arwen - I've come to help you",
                "target": "Ich bin Arwen - Ich bin gekommen, um dir zu helfen",
                "sourceLanguage": "en",
                "targetLanguage": "de"
            }])
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('message').eql("Validation error, these fields must be present in array: source");
                res.body.should.have.property('code').eql(400);
                res.body.should.have.property('error').eql(true);
                done();
            });
    });

    it('should fail of wrong data input of all payload', (done: any) => {
        chai.request(app)
            .post('/store_translation')
            .send([{
                "sourc": "I am Arwen - I've come to help you",
                "targe": "Ich bin Arwen - Ich bin gekommen, um dir zu helfen",
                "sourceLanguag": "en",
                "targetLanguag": "de"
            }])
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(400);
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('message').eql("Validation error, these fields must be present in array: source,target,sourceLanguage,targetLanguage");
                res.body.should.have.property('code').eql(400);
                res.body.should.have.property('error').eql(true);
                done();
            });
    });
});

// Testing Get tranlations
describe('/Get translations data', () => {
    it('translation not available', (done) => {
        chai.request(app)
            .get('/translation?target=de&source=eneee&word=randomnonexistingstring')
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(404);
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('data');
                res.body.should.have.property('message').eql("translation not found");
                res.body.should.have.property('code').eql(404);
                res.body.should.have.property('error').eql(true);
                done();
            });
    });
});




// Testing Get translations
describe('/Get translations data', () => {
    it('should translations with data of users', (done) => {
        chai.request(app)
            .get('/translation?target=de&source=en&word=hello')
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('message').eql("translation gotten successfully");
                res.body.should.have.property('code').eql(200);
                res.body.should.have.property('error').eql(false);
                res.body.should.have.property('data')
                done();
            });
    });
});
