# One-time automatic deployment

Run once on the Google Cloud VM:

```bash
sudo apt update && sudo apt install -y git nginx
sudo npm install -g pm2
sudo mkdir -p /var/www/bohol-vending
sudo chown -R "$USER":"$USER" /var/www/bohol-vending
git clone YOUR_GITHUB_REPOSITORY_URL /var/www/bohol-vending
cd /var/www/bohol-vending
chmod +x deploy/deploy.sh
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

In GitHub repository settings, add three Actions secrets:

- `DEPLOY_HOST`: the server public IP
- `DEPLOY_USER`: the SSH username
- `DEPLOY_SSH_KEY`: the private key matching the VM's authorized key

After that, every push to `main` automatically builds and restarts the site. Keep private keys only in GitHub Secrets; never commit them.
