/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/


const common = require('../common');
const dbModule = require('../bdd/main');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginUser(data) {
    try {
        var bdd = await dbModule.loadDatabase('dashium');
        var entries = await dbModule.selectRows(bdd, 'global');
            entries[0].json = JSON.parse(entries[0].json);

        const SECRET_KEY = entries[0].json.server.encrypt;

        const { email, password } = data;

        // Vérifie si l'utilisateur existe
        const user = await dbModule.selectRows(bdd, 'users', '*', 'email = ?', [email]);
        if (user.length == 0) {
            common.warn('Invalid email or password', 'account');
            return { error: 'Invalid email or password' };
        }

        // Vérifie si le mot de passe correspond
        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            common.warn('Invalid email or password', 'account');
            return { error: 'Invalid email or password' };
        }

        // Génère un token JWT
        const token = jwt.sign({ userId: user[0].id, expire: common.datePlus24h() }, SECRET_KEY);

        common.sucess('Login successful', 'account');

        return { message: 'Login successful', token };
    } catch (error) {
        common.error(error, 'account');
        return { error: 'Internal server error' };
    }
}

async function verifyToken(token) {
    try {
        // Charge la clé secrète depuis la base de données
        const bdd = await dbModule.loadDatabase('dashium');
        var entries = await dbModule.selectRows(bdd, 'global');
            entries[0].json = JSON.parse(entries[0].json);
        const secretKey = entries[0].json.server.encrypt;

        // Vérifie le token JWT
        let decodedToken = null;
        try {
            decodedToken = jwt.verify(token, secretKey);
        } catch (err) {
            common.error('Invalid token', 'account');
            return { error: 'Invalid token' };
        }

        const userId = decodedToken.userId;
        const expire = decodedToken.expire;

        // Vérifie si l'utilisateur associé au token existe dans la base de données
        const user = await dbModule.selectRows(bdd, 'users', '*', 'id = ?', [userId]);
        if (user.length == 0) {
            common.error('Invalid token', 'account');
            return { error: 'Invalid token' };
        }

        if (common.isTimestampUpcoming(expire) == false) {
            common.error('Invalid token', 'account');
            return { error: 'Invalid token' };
        }

        common.log('Valid token', 'account');

        // Le token est valide
        return { message: 'Valid token' };
    } catch (error) {
        common.error(error, 'account');
        return { error: 'Invalid token' };
    }
}

async function registerUser(data) {
    try {
        var bdd = await dbModule.loadDatabase('dashium');
        const { email, password, type } = data;

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await dbModule.selectRows(bdd, 'users', '*', 'email = ?', [email]);
        if (existingUser.length > 0) {
            common.warn('Email already exists', 'account');
            return { error: 'Email already exists' };
        }

        // Hash le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ajoute l'utilisateur à la base de données
        await dbModule.insertRow(bdd, 'users', { email, password: hashedPassword, type });

        common.sucess('User created successfully', 'account');
        return { message: 'User created successfully' };
    } catch (error) {
        common.error(error, 'account');
        return { error: 'Internal server error' };
    }
}

module.exports = {
    loginUser,
    registerUser,
    verifyToken
}