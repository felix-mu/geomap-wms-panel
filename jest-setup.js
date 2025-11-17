// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';
import path from 'path';
import { TextEncoder, TextDecoder } from 'util';

globalThis.PLUGIN_VERSION = require(path.resolve(process.cwd(), 'package.json')).version;


globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
