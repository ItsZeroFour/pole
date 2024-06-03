module.exports = {
  apps: [
    {
      name: 'pole',
      script: 'serve',
      args: '-s build',
      env: {
        PM2_SERVE_PATH: './build',
        PM2_SERVE_PORT: 3000
      }
    }
  ]
};
