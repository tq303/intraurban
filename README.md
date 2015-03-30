# intraurban

## Requirements

All commands assume you are using Ubuntu 14.04, though most Debian based Linux distributions will work.

### Pre-Installation
```bash
Before running Installation, please edit the username in ./jack/config
```
### Installation
```bash
./config
```
## Post-Installation
You will need to add your user to the limits.conf.
```bash
sudo nano /etc/security/limits.conf
```

Append the following to the file

	username    hard    memlock    unlimited
	username    soft    memlock    unlimited