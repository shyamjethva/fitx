import paramiko

def run():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect('69.62.82.12', username='root', password='Eri404@scale')

    target_dir = "/var/www/fitx"
    commands = [
        f"cd {target_dir}/frontend && npm run build",
        "systemctl reload nginx || pm2 reload fitx || true"
    ]

    for cmd in commands:
        print(f"Running: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        
        # wait for command to finish
        exit_status = stdout.channel.recv_exit_status()
        print("EXIT STATUS:", exit_status)

    ssh.close()

if __name__ == '__main__':
    run()
