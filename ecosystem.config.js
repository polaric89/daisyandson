/**
 * PM2 Ecosystem Configuration
 * For managing Node.js processes on your server
 * 
 * Install PM2: npm install -g pm2
 * Start: pm2 start ecosystem.config.js
 * Stop: pm2 stop ecosystem.config.js
 * Restart: pm2 restart ecosystem.config.js
 * Status: pm2 status
 * Logs: pm2 logs
 */

export default {
  apps: [{
    name: 'daisyandson-api',
    script: './server/index.js',
    cwd: '/var/www/daisyandson.co',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
}

