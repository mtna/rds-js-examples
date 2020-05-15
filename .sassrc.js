/**
 * This is necessary so Parcel can bundle
 * imported sass from dependencies.
 */

const path = require('path');

const CWD = process.cwd();

module.exports = {
  includePaths: [path.resolve(CWD, 'node_modules'), path.resolve(CWD, 'src')],
};
