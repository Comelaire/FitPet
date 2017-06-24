# [FitPet](http://fitpet.comelaire.fr)

FitPet is a cute fitness tracker app which helps you to keep you fit. It is built on top of Bootstrap 3 and it is fully responsive. It works with a Jawbone fitness tracker with the UP synch process.
s
Special thanks go to:
Chartist for the wonderful charts

## Quick start

Quick start options:

- [Download from Github](https://github.com/Comelaire/FitPet.git).
- Clone the repo: `git clone https://github.com/Comelaire/FitPet.git`.

# Installation procedure
- You must host source code on a server using HTTPS protocol, as required by Jawbone API.
- Copy all the sources in any server folder, and access its index.html file. However, most server configurations automatically target this file as default web page.

## Callback configuration
- If you want to use your FitPet with your own app, you have to create a Jawbone developer account.
- Then, navigate to "manage account", click "create app" and fill required information.
- In application links, fill "OAuth Redirect URIs" section with the FitPet URI on your server.
- Finally, update credentials in main.js file on lines 6 and 9, with client id and client secret.

### Version logs
- V0.1 - 24 June 2017 [current version]
- V0.0 - 18 June 2017 [current version]
- switched to MIT license

### License

- Copyright 2017 FitPet
- Licensed under MIT

## Useful Links

More about me : <http://www.comelaire.fr>
