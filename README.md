# BIAL  Proof of Concept
[![Node.js](https://img.shields.io/badge/Node.js-8.9-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-5.5.1-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)
[![OAuth2](https://img.shields.io/badge/OAuth2-v1-green.svg)](http://developer.autodesk.com/)

# Description
This sample reads and translates the Model from BIM 360, and launches Viewer with translated model.
Reads the sensor data from JSON file updated to BIM 360 through a .NET client application, and displays the sensor information such as `pressure [MPa]` and `temperature [°C]` on a Viewer panel.

## Working GIF

![](https://github.com/MadhukarMoogala/Bialpoc/blob/master/media/BIALPoc.gif)

## Live 

[LiveDemo](https://fpd-bialpoc.herokuapp.com/)

## Setup
In order to use this sample you need Autodesk developer credentials. Visit the [Forge Developer Portal](https://developer.autodesk.com), sign up for an account, then [create an app](https://developer.autodesk.com/myapps/create). Finally take note of the `Client ID` and `Client Secret`.
## Run Locally

Install [NodeJS](https://nodejs.org/).

Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

```
git clone https://github.com/MadhukarMoogala/Bialpoc.git
```
To run it, install the required packages, set the environment variables with your `Client ID`and `Client Secret`
```bash
npm install
export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
export FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
nodemon app
```

Windows (use `Node.js command line` from Start menu)
```bash
npm install
set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
set FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
nodemon app
```

Open the browser: [http://localhost:3000](http://localhost:3000).

## Debuging
**Create Launch.json**
```
{   
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "envFile": "${workspaceFolder}/set.env",            
            "program": "${workspaceFolder}/app.js"
        }
    ]
}
```
**Create a .env file**
```
 #FORGE
 FORGE_CLIENT_ID=putyourclientid
 FORGE_CLIENT_SECRET=putyoursecret
 FORGE_CALLBACK_URL=http://localhost:3000/api/forge/callback/oauth
```
Deploy on Heroku
To deploy this application to Heroku, After clicking on the button below, at the Heroku Create New App page, set your 
​			   `FORGE_CLIENT_ID`,
​			   `FORGE_CLIENT_SECRET`
​			   

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/MadhukarMoogala/fda-dwgcompare.git)

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.

## Written by

Madhukar Moogala (Forge Partner Development)
http://forge.autodesk.com


