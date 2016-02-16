# RNSH-Pilot-Server
Server for RNSH Pilot


# Manual Deployment

1. Ensure the build you want to deploy is tagged in git.
2. SSH to the server
3. Navigate to the directory with the git repo in it.
4. Run `git pull`
5. Run `git checkout tags/<tag-no>` Where <tag-no> is the name of the git tag we want to be serving.
6. Restart the process with pm2:
    1. Run `pm2 list` and identify the process you need to restart.
    2. Run `pm2 restart <processId>` where <processId> is the ID of the process you identified with `pm2 list`.

# Server Config

## nginx

***Note: all occurrences of rnshpilot-api.fiviumdev.com below should be replace with the actual domain you are using)***

1. Install nginx `sudo apt-get install nginx`
1. Install node:
    1. `cd ~`
    2. `wget https://nodejs.org/dist/v5.3.0/node-v5.3.0-linux-x64.tar.gz`
    3. `mkdir node`
    4. `tar xvf node-v*.tar.gz --strip-components=1 -C ./node`
    5. `mkdir node/etc`
    6. `echo 'prefix=/usr/local' > node/etc/npmrc`
    7. `sudo mv node /opt/``
    8. `sudo chown -R root: /opt/node`
    9. `sudo ln -s /opt/node/bin/node /usr/local/bin/node`
    10. `sudo ln -s /opt/node/bin/npm /usr/local/bin/npm`
2. Create a directory to serve the app from (e.g. /srv/api.rnshpilot.fiviumdev.com)
3. Clone this git repo to this directory `git clone http://github.com/FiviumAustralia/RNSH-Pilot-Server`
4. Run `npm install`
5. Install pm2 (a production process manager for node apps):
    1. `npm install pm2 -g`
6. Start pm2 with `pm2 start /srv/RNSH-Pilot-Server/bin/server.js`
7. Create a config by copying the default one `cp /etc/nginx/site-available/default /etc/nginx/site-available/rnshpilot-api.fiviumdev.com `
8. Modify the following in the contents of the newly created file.
  ```
  server {
          listen 80;
          #listen [::]:80 default_server ipv6only=on;

          root /var/www/rnshpilot-api.fiviumdev.com ;
          index index.html index.htm;

          # Make site accessible from http://localhost/
          server_name rnshpilot-api.fiviumdev.com ;

          location / {
                  proxy_pass http://localhost:3001;
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection 'upgrade';
                  proxy_set_header Host $host;
                  proxy_cache_bypass $http_upgrade;
          }
```
9. Restart nginx `service nginx restart`
