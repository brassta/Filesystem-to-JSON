/**
 * Web:  www.agenzzia.com
 * Author: Branko Stevanovic (branko@agenzzia.com)
 * Date: 19-Jan-21
 * Time: 15:41
 */
const { resolve } = require('path');
const { readdir } = require('fs').promises;
const dirTree = require("directory-tree");
import { v4 as uuidv4 } from 'uuid'

export async function getFiles(dir, args, jsonResult = [], traversePath = []) {
  if(!dir) return;
  const newAttributes = args[0].attributes;
  newAttributes.push('id');
  const searchedDirectoryName = dir.split('\\').splice(-1)[0];
  let testreplace = dir.replace(searchedDirectoryName, '');
  testreplace = `(${testreplace.replace(/\\/g, '\\/')})`;
  // const replaceAbsolutePathSample = '(F:\/xampp\/htdocs\/razvitak\/)';
  const replacer = new RegExp(testreplace, 'g')
  const tree = dirTree(dir, {
    normalizePath: true,
    attributes   : args[0].attributes.map((attribute) => {
      return attribute.trim()
    })
  }, (item, PATH, stats) => { //file

    Object.keys(item).map((key) => {
      if(!item[key]){
        item[key] = '';
      }
      item.id = uuidv4()
    })
  }, (item, PATH, stats) => { //directory
    args[0].attributes.map((attribute) => {
      item[attribute] = '';
    })
    item.id = uuidv4()
  });
  return JSON.stringify(tree).replace(replacer, './');
}
