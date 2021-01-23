const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

import { getFiles } from './main-process/folder-process2'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if(require('electron-squirrel-startup')){ // eslint-disable-line global-require
  app.quit();
}

let mainWindow = null;

const createWindow = () => {
  let iconPath = '';

  console.log('ikonica', iconPath);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width         : 1000,
    height        : 600,
    webPreferences: {
      nodeIntegration: true
    },
    // icon: iconPath
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  mainWindow.removeMenu();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if(BrowserWindow.getAllWindows().length === 0){
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.



// Main process
ipcMain.handle('openFolderDialog', async (event, args) => {

  console.log(__dirname);
  let finale = '';
  await dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then((result) => {
    getFiles(result.filePaths[0], args).then((response) => {
      finale = response;
    })
  })
  return finale;
})

ipcMain.handle('saveDialog', async (event, args) => {
  let result = false;
  await dialog.showSaveDialog(mainWindow, {
    title  : 'Save JSON',
    filters: [
      { name: 'JSON files', extensions: ['json'] },
      { name: 'Text files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }).then((response) => {
    if(!response.canceled){
      fs.writeFile(response.filePath, args[0].jsonText, (err) => {
        console.log(err);
      })
    }
  })
  // fs.writeFile()
  return true;
})

ipcMain.handle('closeApp', ((evt) => {
  app.quit();
}))