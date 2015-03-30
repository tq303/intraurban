# intraurban

## Requirements

All commands assume you are using Ubuntu 14.04.

### Pre-configuration
```bash
Before running configuration, please edit the username in ./jack/config
```
### Configuration
```bash
./config
```
## Post-Configuration
You will need to add your user to the limits.conf.
```bash
sudo nano /etc/security/limits.conf
```

Append the following to the file

	username    hard    memlock    unlimited
	username    soft    memlock    unlimited