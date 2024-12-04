// src/controllers/authController.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const User = require('../models/User');
const { register, login } = require('./authController');

describe('Auth Controller', () => {
  describe('register', () => {
    it('should register a new user', async () => {
      const req = { body: { username: 'testuser', email: 'test@example.com', password: 'password' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const userStub = sinon.stub(User, 'create').resolves({ id: 1, username: 'testuser', email: 'test@example.com' });

      await register(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'User registered successfully' })).to.be.true;

      userStub.restore();
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      const userStub = sinon.stub(User, 'findByEmail').resolves({ id: 1, email: 'test@example.com', password: '$2b$10$EIX...HASH' });
      const bcryptStub = sinon.stub(require('bcrypt'), 'compare').resolves(true);

      await login(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Login successful' })).to.be.true;

      userStub.restore();
      bcryptStub.restore();
    });
  });
});
