module.exports = {
  PROTOCOL: process.env.SERVER_PROTOCOL || 'http',
  HOST: process.env.SERVER_HOST || '15.206.24.203',
  PORT: process.env.SERVER_PORT || '4000',
  get URL() { return `${this.PROTOCOL}://${this.HOST}:${this.PORT}` }
};



