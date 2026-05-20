import paramiko
import sys

def run(cmd):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        ssh.connect('69.62.82.12', port=22, username='root', password='Eri404@scale', timeout=10)
        stdin, stdout, stderr = ssh.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        print("STDOUT:", out)
        if err:
            print("STDERR:", err)
    finally:
        ssh.close()

if __name__ == '__main__':
    run(sys.argv[1])
