'use strict';

exports.register = function () {
    const plugin = this;

    try {
        plugin.imap = require('imap');
    }
    catch (ignore) {}

    if (!plugin.imap) {
        plugin.logerror('imap library not found, try \'npm -g install imap\' or \'npm install imap\' in your configuration directory to install it');
        return;
    }

    plugin.inherits('auth/auth_base');
    plugin.load_imap_ini();
};

exports.load_imap_ini = function () {
    const plugin = this;
    plugin.cfg = plugin.config.get('auth_imap.ini', function () {
        plugin.load_imap_ini();
    });
};

exports.hook_capabilities = function (next, connection) {
    // Don't offer AUTH capabilities by default unless session is encrypted
    if (connection.tls.enabled) {
        const methods = ['PLAIN', 'LOGIN'];
        connection.capabilities.push('AUTH ' + methods.join(' '));
        connection.notes.allowed_auth_methods = methods;
    }
    next();
};

const ca_cache = {}
exports.check_plain_passwd = function (connection, user, passwd, cb) {
    const plugin = this;
    let trace_imap = false;
    const config = {
        user: user,
        password: passwd,
        host: 'localhost',
        port: 143,
        tls: false
    };

    const domain = (user.split('@'))[1];
    let sect = plugin.cfg.main;
    let section_name = 'main';
    if (domain && plugin.cfg[domain]) {
        sect = plugin.cfg[domain];
        section_name = domain;
    }

    if (sect.trace_imap == 'true') {
        trace_imap = true;
        config.debug = function (info) {
            connection.logdebug(plugin, info);
        }
    }
    if (sect.host) {
        config.host = sect.host;
    }
    if (sect.port) {
        config.port = sect.port;
    }
    if (sect.tls) {
        config.tls = (sect.tls === 'true');
    }
    if (sect.ca) {
        if (!ca_cache[section_name]) {
            ca_cache[section_name] = require('fs').readFileSync(sect.ca);
        }
        config.tlsOptions = {ca: [ca_cache[section_name]]};
    }
    if (sect.rejectUnauthorized) {
        if (!config.tlsOptions) {
            config.tlsOptions = {};
        }
        config.tlsOptions.rejectUnauthorized = (sect.rejectUnauthorized === 'true');
    }
    if (sect.connTimeout) {
        config.connTimeout = parseInt(sect.connTimeout, 10);
    }
    if (sect.authTimeout) {
        config.authTimeout = parseInt(sect.authTimeout, 10);
    }

    if (sect.users) {
        if (sect.users.split(/\s*,\s*/).indexOf((user.split('@'))[0]) < 0) {
            connection.loginfo(plugin, 'AUTH user="' + user +
                '" is not allowed to authenticate by imap'
            );
            return cb(false);
        }
    }

    const client = new plugin.imap(config);

    let message = 'section="' + section_name + '" host="' +
        config.host + '" port="' + config.port + '" tls=' + config.tls;
    if (config.tlsOptions) {
        message += ' rejectUnauthorized=' + config.tlsOptions
            .rejectUnauthorized;
    }
    if (config.connTimeout) {
        message += ' connTimeout=' + config.connTimeout;
    }
    if (config.authTimeout) {
        message += ' authTimeout=' + config.authTimeout;
    }
    connection.logdebug(plugin, message);

    client.once('ready', function () {

        connection.loginfo(plugin, 'AUTH user="' + user +
            '" success=true');
        if (trace_imap) {
            connection.logdebug(plugin, client);
        }
        client.end();
        return cb(true);
    });

    client.once('error', function (err) {
        connection.loginfo(plugin, 'AUTH user="' + user +
            '" success=false error="' + err.message + '"');
        if (trace_imap) {
            connection.logdebug(plugin, client);
        }
        return cb(false);
    });

    client.connect();
};
