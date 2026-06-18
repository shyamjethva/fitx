import paramiko
import sys

def run_ssh_command(host, user, password, command):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, username=user, password=password, timeout=10)
        
        print(f"Executing: {command}")
        stdin, stdout, stderr = ssh.exec_command(command)
        
        # Wait for command to finish
        exit_status = stdout.channel.recv_exit_status()
        
        out = stdout.read().decode('utf-8')
        err = stderr.read().decode('utf-8')
        
        print(f"Exit Status: {exit_status}")
        if out:
            print("STDOUT:")
            print(out.encode('ascii', 'ignore').decode())
        if err:
            print("STDERR:")
            print(err)
            
        ssh.close()
    except Exception as e:
        print(f"Connection/Execution failed: {e}")

if __name__ == "__main__":
    host = "69.62.82.12"
    user = "root"
    password = "Eri404@scale"
    command = " ".join(sys.argv[1:])
    if not command:
        command = "ls -la /var/www"
    run_ssh_command(host, user, password, command)
