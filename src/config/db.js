module.exports = {
  PROTOCOL: process.env.DB_PROTOCOL || 'mongodb',
  HOST: process.env.DB_HOST || '127.0.0.1',
  PORT: process.env.DB_PORT || 27017,
  NAME: process.env.DB_NAME || 'chatApp',
  USER: '',
  PASSWORD: '',
  get URL() { return process.env.dbUrl || `${this.PROTOCOL}://${this.HOST}:${this.PORT}/${this.NAME}` }
}