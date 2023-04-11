#!/bin/bash

sudo nvm uninstall v16.18.0#!/bin/bash
rm -rf ~/.nvm
rm -rf ~/.npm
rm -rf ~/.bower
sed -i '/NVM_DIR/d' ~/.bashrc
sed -i '/bash_completion/d' ~/.bashrc
source ~/.bashrc
sudo rm -rf $NVM_DIR
sudo apt purge nvm -y
sudo apt purge nodejs -y
sudo apt purge npm -y
sudo apt purge git -y
sudo apt purge docker.io -y
sudo rm -rf /usr/local/bin/npm /usr/local/share/man/man1/node* /usr/local/lib/dtrace/node.d ~/.npm ~/.node-gyp /opt/nodejs /usr/lib/node*
sudo apt autoremove -y
# Mettre à jour le système
sudo apt-get update && sudo apt-get upgrade -y

sudo rm -rf /dashium
