const common = require('../common');
const dbModule = require('../bdd/main');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginUser(data){
    try {
        var bdd = await dbModule.loadDatabase('dashium');
        var entries = await dbModule.selectRows(bdd, 'global');
            entries[0].json = JSON.parse(entries[0].json);
        
        const SECRET_KEY = entries[0].json.server.encrypt;

        const { email, password } = data;

        // Vérifie si l'utilisateur existe
        const user = await dbModule.selectRows(bdd, 'users', '*', 'email = ?', [email]);
        if (user.length == 0) {
            common.warn('Invalid email or password', 'api');
            return { error: 'Invalid email or password' };
        }

        // Vérifie si le mot de passe correspond
        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            common.warn('Invalid email or password', 'api');
            return { error: 'Invalid email or password' };
        }

        // Génère un token JWT
        const token = jwt.sign({ userId: user[0].id }, SECRET_KEY);

        common.sucess('Login successful', 'api');

        return { message: 'Login successful', token };
    } catch (error) {
        common.error(error, 'api');
        return { error: 'Internal server error' };
    }
}

async function registerUser(data){
    try {
        var bdd = await dbModule.loadDatabase('dashium');
        const { email, password, type } = data;

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await dbModule.selectRows(bdd, 'users', '*', 'email = ?', [email]);
        if (existingUser.length > 0) {
            common.warn('Email already exists', 'api');
            return { error: 'Email already exists' };
        }

        // Hash le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ajoute l'utilisateur à la base de données
        await dbModule.insertRow(bdd, 'users', { email, password: hashedPassword, type });

        common.sucess('User created successfully', 'api');
        return { message: 'User created successfully' };
    } catch (error) {
        common.error(error, 'api');
        return { error: 'Internal server error' };
    }
}

module.exports = {
    loginUser,
    registerUser
}