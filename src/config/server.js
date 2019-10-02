module.exports = {
  PROTOCOL: process.env.SERVER_PROTOCOL || 'http',
  HOST: process.env.SERVER_HOST || '172.31.6.27',
  PORT: process.env.SERVER_PORT || '4001',
  get URL() { return `${this.PROTOCOL}://${this.HOST}:${this.PORT}` }
};



