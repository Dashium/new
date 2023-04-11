#!/bin/bash

sudo apt purge build-essential -y
sudo apt purge nodejs -y
sudo apt purge npm -y
sudo apt purge git -y
sudo apt purge docker.io -y
sudo rm -rf /usr/local/bin/npm /usr/local/share/man/man1/node* /usr/local/lib/dtrace/node.d ~/.npm ~/.node-gyp /opt/nodejs /usr/lib/node*
sudo apt autoremove -y
# Mettre à jour le système
sudo apt-get update && sudo apt-get upgrade -y

sudo rm -rf /dashium
