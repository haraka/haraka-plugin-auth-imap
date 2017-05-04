[![Build Status][ci-img]][ci-url]
[![Code Climate][clim-img]][clim-url]
[![Greenkeeper badge][gk-img]][gk-url]
[![NPM][npm-img]][npm-url]
<!-- requires URL update [![Windows Build Status][ci-win-img]][ci-win-url] -->
<!-- doesn't work in haraka plugins... yet. [![Code Coverage][cov-img]][cov-url]-->

# haraka-plugin-auth-imap

Authenticate against an imap server.

## Configuration

Configuration is stored in `config/auth_imap.ini` and uses INI
style formatting.

These are the configuration settings:

* host: The host/IP that the imap server is listening on (default: localhost).

* port: The TCP port that the imap server is listening on (default: 143).

* tls: Perform implicit TLS connection? (default: false).

* rejectUnauthorized: Set rejectUnauthorized in tlsOptions for 
  imap connection (default: do not set tlsOptions).

* connTimeout: Number of milliseconds to wait for a connection to be 
  established (default: none).

* authTimeout: Number of milliseconds to wait to be authenticated after a 
  connection has been established (default: none).

* users: comma separated list of users (local part before '@') which are 
  allowed to be authenticated by the imap server. If this setting is missing,
  all users are allowed. So use this setting, if you have no control over 
  the imap server because otherwise you could create an open relay, e.g.
  if you would authenticate with gmail and do not set users, every gmail
  user could use your mail server to send mail (default: none).

* trace_imap: if true, emit imap debug information. Do not use this in
  production because it logs sensitive information, e.g. passowrds in
  clear text (default: none).

### Per-domain Configuration

Additionally, domains can each have their own configuration for connecting
to the imap server. The defaults are the same, so only the differences needs 
to be declared. Example:

    host=imap.example.com
    
    [gmail.com]
    host=imap.gmail.com
    port=993
    tls=true
    users=arthur,trillian,ford

    [example2.com]
    host=imap.example2.com
    port=993
    tls=true



<!-- leave these buried at the bottom of the document -->
[ci-img]: https://travis-ci.org/haraka/haraka-plugin-template.svg
[ci-url]: https://travis-ci.org/haraka/haraka-plugin-template
[ci-win-img]: https://ci.appveyor.com/api/projects/status/CHANGETHIS?svg=true
[ci-win-url]: https://ci.appveyor.com/project/haraka/haraka-CHANGETHIS
[cov-img]: https://codecov.io/github/haraka/haraka-plugin-template/coverage.svg
[cov-url]: https://codecov.io/github/haraka/haraka-plugin-template
[clim-img]: https://codeclimate.com/github/haraka/haraka-plugin-template/badges/gpa.svg
[clim-url]: https://codeclimate.com/github/haraka/haraka-plugin-template
[gk-img]: https://badges.greenkeeper.io/haraka/haraka-plugin-template.svg
[gk-url]: https://greenkeeper.io/
[npm-img]: https://nodei.co/npm/haraka-plugin-template.png
[npm-url]: https://www.npmjs.com/package/haraka-plugin-template
