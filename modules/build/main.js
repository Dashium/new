const common = require('../common');

common.mkdir('./build');
common.copyDir('./modules/dashboard/.next', './build/.next');
common.copyDir('./modules/dashboard/public', './build/public');
common.copyDir('./modules/dashboard/pages', './build/pages');