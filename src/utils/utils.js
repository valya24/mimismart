// var xml2js = require("xml2js");
// var DOMParser = require('xmldom').DOMParser;

var convert = require('xml-js')

export function getDefaultItemIcon(item) {
  let icon = "script";

  if (item.attributes['sub-type'] && ( item.attributes.type == "virtual" || !item.attributes.type ) ) {
    icon = item.attributes['sub-type'];
  } else if (item.attributes.type) {
    icon = item.attributes.type;
  }

  if (icon.includes('-sensor')) {
    icon = icon.split('-sensor')[0];
  }

  return icon;
}

// export function parseAreasFromXML(xml) {
//   let parser = new xml2js.Parser();
//   let xmlSerialized = new DOMParser().parseFromString(xml, "application/xml");
//   console.log(xmlSerialized)

//   return parser.parseStringPromise(xml)
//     .catch(function (err) {
//       console.error(err);
//     })
//     .then((res) => {
//       let counter = 0;
//       let areas = res['smart-house'].area;

//       areas = areas.map(area => {
//         //  Flatten areas
//         if (!area.area) {
//           area = {
//             $: { name: area.$.name },
//             area: [area]
//           };
//         }

//         if (area.item && area.item.length) {
//           area.item = area.item.filter(item => item && item.$);
//         }


//         //  Set areas ID
//         area.area = area.area.map(room => {
//           room.$.id = counter;
//           counter++;

//           room.$._itemCount = 0;
//           room._sensors = [];
//           room._areaItems = [];

//           //  Add <area> items to all rooms
//           if (area.item && area.item.length) {
//             room._areaItems = area.item;
//           }
//           //  Set items icons
//           if (room.item && room.item.length) {
//             // room._sensors = [];

//             room.item = room.item.filter(item => item && item.$);

//             room.item = room.item.map(item => {

//               //  Fill room._sensors
//               if (item.$.type.includes('sensor')) {
//                 room._sensors.push(item);
//               }

//               //  Set items icons
//               let icon;
//               if (item.$.icon) {
//                 icon = item.$.icon;
//               } else if (item.$.image) {
//                 icon = item.$.image;
//               } else {
//                 icon = getDefaultItemIcon(item);
//               }
              
//               item.$._icon = icon;
//               item.$._status = [0];

//               return item;
//             });

//             //  Count not hidden items
//             room.$._itemCount += room.item
//               .filter(item => item && item.$ && item.$.system != 'yes').length;

//               //  Add empty <item> array if not preset
//           } else {
//             room.item = new Array(0);
//           }
//           //  <area> items in room
//           if (room._areaItems && room._areaItems.length) {
//             // room._sensors = [];

//             room._areaItems = room._areaItems.filter(item => item && item.$);

//             room._areaItems = room._areaItems.map(item => {

//               //  Fill room._sensors
//               if (item.$.type.includes('sensor')) {
//                 room._sensors.push(item);
//               }

//               //  Set items icons
//               let icon;
//               if (item.$.icon) {
//                 icon = item.$.icon;
//               } else if (item.$.image) {
//                 icon = item.$.image;
//               } else {
//                 icon = getDefaultItemIcon(item);
//               }

//               item.$._icon = icon;
//               item.$._status = [0];

//               return item;
//             });

//             //  Count not hidden items
//             room.$._itemCount += room._areaItems
//               .filter(item => item && item.$ && item.$.system != 'yes').length;
//           }
          
//           if (room._sensors && room._sensors.length) {
//             room._sensors.filter(item => item.$.system != 'yes');
//           }

//           return room;
//         });

//         return area;
//       });
//       console.log(res, areas);

//       return { config: res, areas };
//     })
// }

function parsePermissions(permStr) {
  let outPerms = {};

  let perms = permStr.split(';');

  perms = perms.map(perm => perm.split(':'))

  perms.forEach(perm => {
    let rights = {};

    switch (perm[1]) {
      case 've+':
        rights.view = true;
        rights.edit = true;
        break;
      case 've-':
        rights.view = false;
        rights.edit = false;
        break;
      case 'v+e-':
      case 'e-v+':
        rights.view = true;
        rights.edit = false;
        break;
      case 'v-e+':
      case 'e+v-':
        rights.view = false;
        rights.edit = true;
        break;
      default: break;
    }

    outPerms[perm[0]] = rights;
  });

  return outPerms;
}

export function parseAreasFromXML(xml) {
  xml = xml.replace(/&/g, '&amp;');

  let obj = convert.xml2js(xml, {
    alwaysChildren: true,
    addParent: true
  });

  let floors = obj.elements[0].elements.filter(element => element.name == "area");

  floors = floors.map( floor => {
    if (floor.attributes && floor.attributes.permissions) {
      if (!floor.__) floor.__ = {};

      floor.__.permissions = parsePermissions(floor.attributes.permissions)
    }

    return floor;
  });

  floors.forEach( floor => {
    floor.elements = floor.elements.map( floorEl => {
      if (floorEl.attributes && floorEl.attributes.permissions) {
        if (!floorEl.__) floorEl.__ = {};

        floorEl.__.permissions = parsePermissions(floorEl.attributes.permissions)
      } else if (floor.__ && floor.__.permissions) {
        if (!floorEl.__) floorEl.__ = {};
        
        floorEl.__.permissions = floor.__.permissions;
      }

      if (floorEl.name == 'area' && floorEl.elements) {
        floorEl.elements = floorEl.elements.map( roomEl => {
          if (roomEl.attributes && roomEl.attributes.permissions) {
            if (!roomEl.__) roomEl.__ = {};

            roomEl.__.permissions = parsePermissions(roomEl.attributes.permissions)
          }

          if (roomEl.name != 'item') {
            return roomEl
          } else {
            if (!roomEl.__) roomEl.__ = {};

            roomEl.__.status = [0];
            
            let icon;
            if (roomEl.attributes.icon) {
              icon = roomEl.attributes.icon;
            } else if (roomEl.attributes.image) {
              icon = roomEl.attributes.image;
            } else {
              icon = getDefaultItemIcon(roomEl);
            }

            roomEl.__.icon = icon;

            return roomEl;
          }
        })
      }

      if (floorEl.name != 'item') {
        return floorEl;
      } else {
        if (!floorEl.__) floorEl.__ = {};

        floorEl.__.status = [0];
        
        let icon;
        if (floorEl.attributes.icon) {
          icon = floorEl.attributes.icon;
        } else if (floorEl.attributes.image) {
          icon = floorEl.attributes.image;
        } else {
          icon = getDefaultItemIcon(floorEl);
        }

        floorEl.__.icon = icon;

        return floorEl;
      }
    })
  })
  // let newXml = convert.js2xml(obj);
  // console.log('new xml = ', newXml);

  return obj;
}


import { tryParseJSON } from '@/utils/functions.js';

function callWebsocketStoreHooks (eventName, event) {
  let namespace = 'ws';

  let target = namespace + '/' + eventName.toUpperCase();
  this.store.dispatch(target, event);
}

export function passToStoreHandler (eventName, event) {
  //  Call main websocket store hooks
  if (eventName.startsWith('SOCKET_')) {
    callWebsocketStoreHooks.call(this, eventName, event);
  }

  if (eventName.startsWith('SOCKET_onmessage')) {
    if (event.data.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
      event.action = "parseAndSaveLogic";
      event.namespace = '';
    }

    let dataObj = tryParseJSON(event.data);
    if (dataObj) {
      // console.log(dataObj);
      if (
        dataObj.event == 'statuses' ||
        dataObj.response == 'subscribeStatus'
      ) {
        event.mutation = 'setRoomDeviceStatuses';
      } else if (dataObj.response == 'executeShiCode') {
        event.mutation = 'shiCodeResponse';
      }
    }

    let method = null;
    let target = null;
    if (event.action && event.action.length) {
      method = 'dispatch';
      target = [event.namespace || '', event.action].filter((e) => !!e).join('/');
    } else if (event.mutation && event.mutation.length) {
      method = 'commit';
      target = [event.namespace || '', event.mutation].filter((e) => !!e).join('/');
    }

    if (!method) return false;

    return this.store[method](target, dataObj ? dataObj : event.data);
  }
}


//  Rebuild XML

// const clone = require('rfdc')()

// function processItem (item) {
//   delete item.$._status;
//   delete item.$._icon;

//   return item;
// }

// function processArea (area) {
//   delete area.$.id;
//   delete area.$._itemCount;

//   delete area._sensors;
//   delete area._areaItems;
//   delete area._refItems;

//   if (area.item && area.item.length) {
//     area.item.forEach( item => processItem(item) );
//   }

//   return area;
// }

// export function rebuildXmlFromObject (obj) {
//   let clonedObj = clone(obj);
//   // console.log(clonedObj);

//   //  Remove app-level area and item props
//   if (clonedObj.area && clonedObj.area.length) {
//     clonedObj.area.forEach( area => {
//       processArea(area);
//       if (area.area && area.area.length) {
//         area.area.forEach( room => processArea(room) );
//       }
//     })
//   }

//   var xmlBuilder = new xml2js.Builder({
//     rootName: 'smart-house',
//     allowSurrogateChars: true,
//     xmldec: {
//       encoding: 'UTF-8'
//     }
//   });

//   let newXml = xmlBuilder.buildObject(clonedObj)
  
//   return newXml;
// }


// Settings
import { SETTINGS_MAP } from '@/utils/consts/consts.js';

export function mapSettings(rawSettings) {
  let result = {};

  for (let key in rawSettings) {
    let newKey = SETTINGS_MAP[key];

    if (newKey.includes('.')) {
      if (!result[newKey.split('.')[0]]) {
        result[newKey.split('.')[0]] = {};
      }
      result[newKey.split('.')[0]][newKey.split('.')[1]] = rawSettings[key]
    }
  }

  return result;
}