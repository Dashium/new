# 💎 Dashium
<p style="text-align:center;">
    <img src="./modules/dashboard/public/logo512.png" width="50%" />
</p>

# 🧮Summary

- [🚧Requirement](#🚧requirement)
- [📦Installation](#📦installation)
- [🗑️Uninstall](#🗑️uninstall)
- [🚀Use](#🚀use)

# 🚧Requirement

- Ubuntu 20.0
- Docker
- NodeJS
- NPM
- Git

# 📦Installation

### Create a Github APP for your dashium:
- First go on [your Github Settings](https://github.com/settings/apps)
- click on `New Github App`
- fill the form with values: <br/>
&nbsp;&nbsp;&nbsp;&nbsp;Github App Name: `Dashium_<YOUR_NAME>` <br/>
&nbsp;&nbsp;&nbsp;&nbsp;Homepage URL: `https://github.com/Dashium/Dashium` <br/>
&nbsp;&nbsp;&nbsp;&nbsp;Callback URL: `empty`
- Generate a private key
- Upload .pem file with dashium and give APP ID
- Go in your public link and add into your github profile


### Install dashium in your machine:
```bash
wget https://raw.githubusercontent.com/Dashium/new/main/setup/setup.sh
chmod +x setup.sh
sh setup.sh
```

# 🗑️Uninstall

```bash
wget https://raw.githubusercontent.com/Dashium/new/main/setup/uninstall.sh
chmod +x uninstall.sh
sh uninstall.sh
```

# 🚀Use

go on: 
```bash
 http://<serverIP>:<serverPORT>
 ```


© [Tai Studio](https://tai-studio.netlify.app) 2021/2023