// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';

import path from 'path';

globalThis.PLUGIN_VERSION = require(path.resolve(process.cwd(), 'package.json')).version;
