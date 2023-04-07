#!/bin/bash

sudo apt purge nodejs -y
sudo apt purge npm -y
sudo apt purge git -y
sudo apt purge docker.io -y
sudo apt autoremove -y
# Mettre à jour le système
sudo apt-get update && sudo apt-get upgrade -y

sudo rm -rf /dashium
