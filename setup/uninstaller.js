const common = require('../modules/common');

common.rmfile('./config/global.json');
common.rmdir('./clusters');
common.rmdir('./logs');
common.rmfile('./config/dashium.db')