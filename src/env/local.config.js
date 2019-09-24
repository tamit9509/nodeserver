/**
 * To start server run command workspace directory
 * >> pm2 start env/live.config.js
 */
let enviromentVaribles = {
  //server
  // dbUrl: "mongodb://192.168.2.27:27017/test",
}


module.exports = {
  apps: [
    {
      script: './server.js',
      name: 'bluebox-backend',
      watch: false,
      env: enviromentVaribles
    }
  ]
}