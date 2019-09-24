module.exports = {
  PROTOCOL: process.env.SERVER_PROTOCOL || 'http',
  HOST: process.env.SERVER_HOST || '0.0.0.0',
  PORT: process.env.SERVER_PORT || '4001',
  get URL() { return `${this.PROTOCOL}://${this.HOST}:${this.PORT}` }
};



