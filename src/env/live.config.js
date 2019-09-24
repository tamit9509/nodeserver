

/**
 * To start server run command workspace directory
 * >> pm2 start env/live.config.js
 */
let enviromentVaribles = {
  // dbUrl: "mongodb://localhost:27017/task_assignment_dev"
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