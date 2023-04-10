const common = require('../modules/common');

common.rmdir('./clusters');
common.rmdir('./logs');
common.rmfile('./config/dashium.db')