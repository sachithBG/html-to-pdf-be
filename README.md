# html-to-pdf-be
pdf generation panel


# Serve
sudo apt install mysql-server
sudo mysql_secure_installation
sudo mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'R00t';
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'R00t' WITH GRANT OPTION;
FLUSH PRIVILEGES;
or
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'R00t' WITH GRANT OPTION;
FLUSH PRIVILEGES;

sudo systemctl start mysql
pm2 start npm --name "pdf-craft-be" -- start 
    or pm2 start npm -- start
pm2 save
pm2 startup
pm2 monit

server {
  listen 80;
  server_name YOUR_IP_ADDRESS;
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}