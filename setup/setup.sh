#!/bin/bash

# Mettre à jour le système
sudo apt-get update && sudo apt-get upgrade -y

# Installer Node.js
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install nodejs -y
sudo apt-get install npm -y

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

# Installer Docker
sudo apt-get install docker.io -y

# Cloner le dépôt Dashium
sudo git clone https://github.com/Dashium/new /dashium

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
