#!/bin/bash

# Mettre à jour le système
sudo apt-get update && sudo apt-get upgrade -y
sudo apt install curl -y

# Installer Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc && sudo nvm install v16.18.0 && sudo nvm use v16.18.0

# Installer Git
sudo apt install git -y

# Vérifier si npm est installé
if ! [ -x "$(command -v npm)" ]; then
  echo "Erreur : npm n'est pas installé sur le système."
  exit 1
fi

# Vérifier si Node.js est installé
if ! [ -x "$(command -v node)" ]; then
  echo "Erreur : Node.js n'est pas installé sur le système."
  exit 1
fi

# Vérifier si Git est installé
if ! [ -x "$(command -v git)" ]; then
  echo "Erreur : Git n'est pas installé sur le système."
  exit 1
fi

# Installer Docker si ce n'est pas déjà fait
if ! [ -x "$(command -v docker)" ]; then
  sudo apt-get install docker.io -y
fi

# Cloner le dépôt Dashium
sudo git clone https://github.com/Dashium/new /dashium

# Vérifier si le clonage du dépôt s'est bien déroulé
if [ ! -d "/dashium" ]; then
  echo "Erreur : le clonage du dépôt Dashium a échoué."
  exit 1
fi

# Exécuter le script de configuration de Dashium
cd /dashium
sudo npm install
sudo npm run setup

for i in {1..50}; do
    echo ""
done

echo "|-----------------------------------------------|"
echo "|   _____            _     _                    |"
echo "|  |  __ \          | |   (_)                   |"
echo "|  | |  | | __ _ ___| |__  _ _   _ _ __ ___     |"
echo "|  | |  | |/ _\` / __| '_ \| | | | | '_ \` _ \    |" 
echo "|  | |__| | (_| \__ \ | | | | |_| | | | | | |   |"
echo "|  |_____/ \__,_|___/_| |_|_|\__,_|_| |_| |_|   |"
echo "|-----------------------------------------------|"
echo "|    Version: v1.0                              |"
echo "|    Installation finish !                      |"
echo "|    enjoy ;)                                   |"
echo "|    © Tai Studio 2021/2023                     |"
echo "|-----------------------------------------------|"
echo " "
