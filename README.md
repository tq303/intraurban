# intraurban

## Requirements

All commands assume you are using Ubuntu 14.04.

### PureData
```bash
sudo apt-get install puredata
```

### Jack
```bash
sudo apt-get install jack
```

### ffmpeg
```bash
sudo apt-get install ffmpeg
```

## Config

You will need to add your user to the limits.conf.
```bash
sudo subl /etc/security/limits.conf
```

Append the following to the file

	username    hard    memlock    unlimited
	username    soft    memlock    unlimited

## Install

```bash
npm install
nodemon
```