module.exports = {
  PROTOCOL: process.env.DOMAIN_PROTOCOL || 'http',
  HOST: process.env.DOMAIN_HOST || '127.0.0.1',
  PORT: process.env.DOMAIN_PORT === '' ? process.env.DOMAIN_PORT : '4000',
  get URL() { return `${this.PROTOCOL}://${this.HOST}${!!this.PORT ? ':' + this.PORT : ''}` },
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4200',
  FRONTEND_CHANGE_PASSWORD_PATH: process.env.FRONTEND_CHANGE_PASSWORD_PATH || 'change-password/{{token}}',
  FRONTEND_VERIFY_EMAIL_ACCOUNT: process.env.FRONTEND_VERIFY_EMAIL_ACCOUNT || 'email-verification/{{token}}',
  get FRONTEND_CHANGE_PASSWORD_URL() { return this.FRONTEND_URL + this.FRONTEND_CHANGE_PASSWORD_PATH },
}