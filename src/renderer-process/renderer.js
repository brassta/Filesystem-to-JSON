/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import '../styles/index.less';
import { ipcRenderer } from 'electron'

const folderDialogButton = document.querySelector('#openbtn');
const saveDialogButton = document.querySelector('#savebutton');

const clearButton = document.querySelector('#clearbutton');
const attributeNamesField = document.querySelector('#attributes');
const displayCloseButton = document.querySelector('#closebutton-display');
const toolbarCloseButton = document.querySelector('#closebutton-toolbar');

const toolbarContainer = document.querySelector('.toolbar');
const displayContainer = document.querySelector('.display');

const displayTextArea = displayContainer.querySelector('textarea');

folderDialogButton.addEventListener('click', ((evt) => {
  const result = { text: '' }
  let attributesText = attributeNamesField.value.replace(/,?\s+/, ', ');
  attributeNamesField.value = attributesText;
  const attributes = attributesText ? attributesText.split(',').map((attribute) => {
    return attribute.trim();
  }) : [];
  const data = {
    attributes,
    result
  }
  ipcRenderer.invoke('openFolderDialog', [data]).then((response) => {
    if(response.length){
      displayContainer.classList.add('visible');
      toolbarContainer.classList.add('display-opened');
      displayTextArea.value = JSON.stringify(JSON.parse(response), undefined, 2);
    }

  });
}));

clearButton.addEventListener('click', (() => {
  displayTextArea.value = '';
  attributeNamesField.value = '';

}));

saveDialogButton.addEventListener('click', ((evt) => {
  const data = {
    jsonText: displayTextArea.value
  }
  ipcRenderer.invoke('saveDialog', [data]);
}))

displayCloseButton.addEventListener('click', (() => {
  ipcRenderer.invoke('closeApp', [])
}))

toolbarCloseButton.addEventListener('click', (() => {
  ipcRenderer.invoke('closeApp', [])
}))


