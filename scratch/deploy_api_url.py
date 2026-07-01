import paramiko
import sys

host = "69.62.82.12"
user = "root"
password = "Eri404@scale"

def run_ssh_commands(commands):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, username=user, password=password, timeout=10)
        
        for cmd in commands:
            print(f"Executing: {cmd}")
            stdin, stdout, stderr = ssh.exec_command(cmd)
            exit_status = stdout.channel.recv_exit_status()
            
            # Use replace to handle unprintable characters
            out = stdout.read().decode('utf-8', errors='replace')
            err = stderr.read().decode('utf-8', errors='replace')
            
            print(f"Exit Status: {exit_status}")
            
            if out:
                sys.stdout.buffer.write(out.encode('utf-8'))
                sys.stdout.buffer.write(b'\n')
            if err:
                sys.stderr.buffer.write(err.encode('utf-8'))
                sys.stderr.buffer.write(b'\n')
            
        ssh.close()
    except Exception as e:
        print(f"Connection/Execution failed: {e}")

if __name__ == "__main__":
    commands = [
        # Change backend .env to 6007
        "sed -i 's/PORT=6001/PORT=6007/g' /var/www/fitx/backend/.env",
        
        # Change fitx.conf proxy_pass to 6007
        "sed -i 's/5010/6007/g' /etc/nginx/sites-available/fitx.conf",
        "sed -i 's/6001/6007/g' /etc/nginx/sites-available/fitx.conf",
        
        # Remove conflicting Nginx config symlink
        "rm -f /etc/nginx/sites-enabled/fitx.errorinfotech.in.conf",
        
        # Restart backend with updated env
        "pm2 restart fitx-backend --update-env",
        
        # Restart nginx to apply proxy changes
        "systemctl restart nginx"
    ]
    run_ssh_commands(commands)
