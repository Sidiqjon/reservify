module.exports = {
  apps: [
    {
      name: 'reservify',
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3333,
      },
    },
  ],
};