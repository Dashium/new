#!/bin/bash

# Mettre à jour le système
sudo apt-get update && sudo apt-get upgrade -y

# Vérifier si Node.js est installé
if ! [ -x "$(command -v node)" ]; then
  echo "Erreur : Node.js n'est pas installé sur le système."
  exit 1
fi

# Installer Node.js
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install nodejs -y

# Vérifier si npm est installé
if ! [ -x "$(command -v npm)" ]; then
  echo "Erreur : npm n'est pas installé sur le système."
  exit 1
fi

# Vérifier si Git est installé
if ! [ -x "$(command -v git)" ]; then
  echo "Erreur : Git n'est pas installé sur le système."
  exit 1
fi

# Cloner le dépôt Dashium
sudo git clone https://github.com/Dashium/Dashium /dashium

# Exécuter le script de configuration de Dashium
cd /dashium
sudo ./setup.sh
