import paramiko

def run():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect('69.62.82.12', username='root', password='Eri404@scale', timeout=15)

    fitx_errorinfotech_conf = """server {
    listen 80;
    server_name fitx.errorinfotech.in barbender.errorinfotech.in;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name fitx.errorinfotech.in barbender.errorinfotech.in;

    root /var/www/fitx/frontend/dist;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/fitx.errorinfotech.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fitx.errorinfotech.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5012;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:5012;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
"""

    fitx_cllero_conf = """server {
    listen 80;
    server_name fitx.cllero.com;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name fitx.cllero.com;

    root /var/www/fitx/frontend/dist;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/fitx.cllero.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fitx.cllero.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5012;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:5012;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
"""

    sftp = ssh.open_sftp()
    
    with sftp.file('/etc/nginx/sites-available/fitx.errorinfotech.in.conf', 'w') as f:
        f.write(fitx_errorinfotech_conf)
    print("Wrote /etc/nginx/sites-available/fitx.errorinfotech.in.conf")

    with sftp.file('/etc/nginx/sites-available/fitx.conf', 'w') as f:
        f.write(fitx_cllero_conf)
    print("Wrote /etc/nginx/sites-available/fitx.conf")

    sftp.close()

    # Test nginx configuration
    stdin, stdout, stderr = ssh.exec_command("nginx -t")
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    err = stderr.read().decode()
    print("NGINX TEST EXIT:", exit_status)
    print("NGINX TEST OUT:", out)
    print("NGINX TEST ERR:", err)

    if exit_status == 0:
        print("Nginx syntax valid. Reloading nginx...")
        stdin, stdout, stderr = ssh.exec_command("systemctl reload nginx")
        reload_status = stdout.channel.recv_exit_status()
        print("NGINX RELOAD EXIT:", reload_status)
        if reload_status == 0:
            print("Successfully reloaded nginx!")
        else:
            print("Reload failed:", stderr.read().decode())
    else:
        print("ERROR: Nginx test failed. Restoring backups...")
        ssh.exec_command("cp /etc/nginx/sites-available/fitx.conf.bak /etc/nginx/sites-available/fitx.conf")
        ssh.exec_command("cp /etc/nginx/sites-available/fitx.errorinfotech.in.conf.bak /etc/nginx/sites-available/fitx.errorinfotech.in.conf")

    ssh.close()

if __name__ == '__main__':
    run()
