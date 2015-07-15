'use strict';

describe('servers', () => {
  describe('RendererServer', () => {
    let app = require('../../config/server');
    let server;
    let request;

    before(done => {
      request = require('supertest').agent(server = app.listen(done));
    });

    after(done => {
      server.close(done);
    });

    it('should return 200', done => {
      request.get('/')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });
  });
});
