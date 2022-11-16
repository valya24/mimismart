import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)


import sensorDeviceInterfaces from "@/utils/sensorDeviceInterfaces.js";

import ws from './modules/websocket/websocket.module.js';
import settings from './modules/settings/settings.module.js';
import watchedSensors from './modules/watchedSensors/watchedSensors.module.js';
import alerts from './modules/alerts/alerts.module.js';
import singleAction from './modules/singleAction/singleAction.module.js';

import popups from './modules/popups/popups.module.js';

import { parseAreasFromXML, mapSettings } from '@/utils/utils.js';
import { transformStatus, numberToByteString, parseSettingsString } from '@/utils/transformers.js';

import { groups, hiddenItemTypes } from '@/utils/consts/consts.js'

// var xml2js = require("xml2js");
// var xmlBuilder = new xml2js.Builder({
//   rootName: 'area',
//   xmldec: {
//     encoding: 'UTF-8'
//   }
// });
var convert = require('xml-js')

function filterItemsAndRefs (elArr, itemMap) {
  return elArr.map(el => {
    if (el.type == 'comment') {
      if (el.comment.startsWith('import-script')) {
        let newEl = (convert.xml2js(`<${el.comment}>`)).elements[0];
        newEl.__ = {
          commented: true,
        };
        newEl.parent = el.parent;

        return newEl;
      }
    }
    if (el.name == "item" || el.name == 'import-script') {
      if (el.name == 'import-script' && el.__ == undefined) {
        Vue.set(el, '__', { commented: false });
        // el.__ = { commented: false };
      }
      return el;
    } else if (el.name == "item-ref") {
      return itemMap[el.attributes.addr];
    } else {
      return null;
    }
  }).filter(item => item !== undefined && item !== null);
}

export default new Vuex.Store({
  state: {
    groups,
    currentRoomAddrs: null,
    conditioner: {},
    lamp: {},
    jalousie: {},
    gate: {},
    valveHeating: {},
    logic: {},
    dimmerLamp: {},
    valve: {},
    rgbLamp: {},
    floors: [],
    // config: {
    //   'smart-house' : {
    //     $: {
    //       name: ''
    //     }
    //   }
    // },
    // areas: { area: [] },
    itemMap: {},
    currentAreaData: {},
    currentRoomData: { item: [] },

    logicParsed: false,

    controllers: {},
    subscribedDevicesAddrs: [],
    // activeItem: { attributes: {} }
  },
  getters: {
    // getAreaDataById: (state) => (id) => {
    //   return state.areas.area.find( (area) => area.area.find( room => room.$.id == id ) !== undefined );
    // },
    // getRoomDataById: (state, getters) => (id) => {
    //   let area = getters.getAreaDataById(id);
    //   return area.area.find( room => room.$.id == id );
    // },

    itemMap: state => state.itemMap,
    conditioner: state => state.conditioner,
    jalousie: state => state.jalousie,
    gate: state => state.gate,
    lamp: state => state.lamp,
    valve: state => state.valve,
    // activeItem: state => state.activeItem,
    valveHeating: state => state.valveHeating,
    dimmerLamp: state => state.dimmerLamp,
    currentRoomAddrs: state => state.currentRoomAddrs,
    rgbLamp: state => state.rgbLamp,
    getCurrentRoomAddrs: state => state.getRoomItems,
    getFloorRooms:(state) => (floorId) => {
      return state.floors.find( floor => floor.__.id == floorId ).elements
        .filter( el => el.name == "area" )
        .filter( room => {
          if (room.__.permissions) {
            let viewBool = room.__.permissions['*'].view;
            if (state.modules.settings.user.key) {
              viewBool = viewBool || room.__.permissions[state.modules.settings.user.key].view;
            }
            return viewBool;
          } else {
            return true;
          }
        });
    },
    getAreaDataById: (state) => (id) => {
      return state.floors.find(floor => floor.__.id == id.split('-')[0] )
    },
    getRoomDataById: (state, getters) => (id) => {
      if (!id) return
      return getters.getFloorRooms(id.split('-')[0]).find( room => room.__.id == id);
    },
    getRoomItems: (state, getters) => (roomId) => {
      if (!getters.getRoomDataById(roomId)) return
      let itemArr = filterItemsAndRefs(getters.getRoomDataById(roomId).elements, state.itemMap);

      filterItemsAndRefs(getters.getAreaDataById(roomId).elements, state.itemMap)
        .forEach( floorItem => {
          if (!itemArr.some(item => item.attributes.addr == floorItem.attributes.addr )) {
            itemArr.push(floorItem);
          }
        });
      
      itemArr = itemArr.filter( item => {
        if (item.__ && item.__.permissions) {
          let viewBool = item.__.permissions['*'].view;
          if (state.modules.settings.user.key) {
            viewBool = viewBool || item.__.permissions[state.modules.settings.user.key].view;
          }
          return viewBool;
        } else {
          return true;
        }
      })

      if (!state.modules.settings.interface.showSystem) {
        itemArr = itemArr.filter(item => !hiddenItemTypes.includes(item.attributes.type) && !hiddenItemTypes.includes(item.attributes['sub-type']));
      }
      
      return itemArr;
    },

    //  USERS
    getUsers: (state) => {
      return state.logic.elements[0].elements.find( el => el.name == 'users' )
        .elements.map(el => {
          let res = {
            ...el.attributes,
            key: el.name
          };
          // if (!res.name || !res.name.length) res.name = el.name;

          return res;
        });
    }
  },
  mutations: {
    // saveConfig(state, payload) {
    //   Vue.set(state, 'config', payload);
    // },
    // saveAreas(state, payload) {
    //   Vue.set(state.areas, 'area', payload);
    //   // state.areas.area = payload;
    //   state.logicParsed = true;
    // },
    setCurrentRoomAddrs(state, addrs) {
      Vue.set(state, 'currentRoomAddrs', addrs);
    },
    setConditionerData(state, payload) {
      Vue.set(state, 'conditioner', payload);
    },

    setLampData(state, payload) {
      Vue.set(state, 'lamp', payload);
    },

    setJalousieData(state, payload) {
      Vue.set(state, 'jalousie', payload);
    },
    setGateData(state, payload) {
      Vue.set(state, 'gate', payload);
    },
    setValveHeatingData(state, payload) {
      Vue.set(state, 'valveHeating', payload);
    },
    setDimmerLampData(state, payload) {
      Vue.set(state, 'dimmerLamp', payload);
    },
    setRgbLampData(state, payload) {
      Vue.set(state, 'rgbLamp', payload);
    },
    setActiveItem(state, payload) {
      Vue.set(state, 'activeItem', payload);
    },
    setValveData(state, payload) {
      state.valve = payload
    },

    saveLogic(state, payload) {
      // Vue.set(state, 'logic', payload);
      state.logic = payload
      let floors = payload.elements[0].elements.filter(element => element.name == "area");

      state.floors = floors
      // Vue.set(state, 'floors', floors);
      
      state.logicParsed = true;
    },
    flattenFloors(state) {
      let floors = state.floors.map( floor => {
        let rooms = floor.elements.filter(element => element.name == 'area');
        if (!rooms || !rooms.length) {
          floor = {
            attributes: floor.attributes,
            name: floor.name,
            type: floor.type,
            elements: [ floor ]
          };
        }
        
        return floor;
      });
      state.floors = floors
      // Vue.set(state, 'floors', floors)
    },
    setAreasIds(state) {
      state.floors.forEach( (floor, floorIndex) => {
        if (!floor.__) { floor.__ = {}; }

        floor.__.id = floorIndex;

        let rooms = floor.elements.filter( el => el.name == "area" );
        if (rooms && rooms.length) {
          rooms.forEach( (room, roomIndex) => {
            if (!room.__) { room.__ = {}; }

            room.__.id = `${floor.__.id}-${roomIndex}`;
          });
        }
      })
    },
    fillRoomsSensors(state) {
      state.floors.forEach( floor => {
        let floorItems = floor.elements.filter( el => el.name == "item" );
        let floorSensors = floorItems
          .filter( item => item.attributes.type.includes('sensor') )
          .map( item => item.attributes.addr );
        // console.log(floor, floorItems,floorSensors);

        let floorRooms = floor.elements.filter( el => el.name == "area" );
        floorRooms.forEach( room => {
          let roomItems = room.elements.filter( el => el.name == "item" );
          let roomSensors = roomItems
            .filter( item => item.attributes.type.includes('sensor') )
            .map(item => item.attributes.addr);


          if (!room.__) { room.__ = {}; }
          room.__.sensors = [].concat(roomSensors, floorSensors);
        })
      })
    },
    createItemMap(state) {
      const itemMap = {...state.itemMap}
      state.floors.forEach(floor => {
        let floorItems = floor.elements.filter(el => el.name == "item");
        
        floorItems.forEach( floorItem => {
          if (!floorItem.__) { floorItem.__ = {}; }
          
          if (!state.itemMap[floorItem.attributes.addr]) {
            itemMap[floorItem.attributes.addr] = floorItem;
          }
        })
        let floorRooms = floor.elements.filter(el => el.name == "area");
        floorRooms.forEach(room => {
          let roomItems = room.elements.filter(el => el.name == "item");
          roomItems.forEach(roomItem => {
            if (!roomItem.__) { roomItem.__ = {}; }
            itemMap[roomItem.attributes.addr] = roomItem;
          })
        })
      })
      state.itemMap = {...itemMap}
    },
    // createItemMap(state) {
    //   let flatAreas = state.areas.area
    //     .reduce((accum, area) => area && area.area && area.area.length ? accum.concat(area.area) : [], []);
      
    //   let flatItems = flatAreas
    //     .reduce((accum, area) => {
    //       if (area.item && area.item.length) {
    //         accum = accum.concat(area.item);
    //       }
    //       if (area._areaItems && area._areaItems.length) {
    //         accum = accum.concat(area._areaItems);
    //       }
    //       return accum;
    //     }, [])
    //     .filter( item => item !== undefined );
    //     //  Remove system items
    //     // .filter(item => item && item.$ && (item.$.system != 'yes') );

    //   state.itemMap = flatItems.reduce( (accum, item) => {
    //     accum[item.$.addr] = item;
    //     return accum;
    //   }, {});
    // },
    parseItemRefs(state) {
      state.floors.forEach(floor => {
        let floorItemRefs = floor.elements.filter(el => el.name == "item-ref");

        floorItemRefs.forEach( floorItemRef => {
          if (state.itemMap[floorItemRef.attributes.addr]) {
            floor.elements.push(state.itemMap[floorItemRef.attributes.addr])
          }
        })
        
        // floorItems.forEach(floorItem => {
        //   if (!state.itemMap[floorItem.attributes.addr]) {
        //     state.itemMap[floorItem.attributes.addr] = floorItem;
        //   }
        // })
        let floorRooms = floor.elements.filter(el => el.name == "area");
        floorRooms.forEach(room => {
          let roomItemRefs = room.elements.filter(el => el.name == "item-ref");

          roomItemRefs.forEach(roomItemRef => {
            if (state.itemMap[roomItemRef.attributes.addr]) {
              room.elements.push(state.itemMap[roomItemRef.attributes.addr])
            }
          })
        })
      })
    },

    setRoomsGroups(state, { getters }) {
      state.floors.forEach((floor) => {
        let rooms = floor.elements.filter(el => el.name == "area");
        if (rooms && rooms.length) {
          rooms.forEach( (room) => {
            if (!room.__) { room.__ = {}; }
            
            let itemArr = getters.getRoomItems(room.__.id);

            let outGroups = {};
            for (let key in groups) {
              let group = groups[key];
              if (
                itemArr.some(item => item.attributes['sub-type'] ? group.types.includes(item.attributes['sub-type']) : group.types.includes(item.attributes.type) )
              ) {
                outGroups[key] = group;
              }
            }

            room.__.groups = outGroups;
          });
        }
      })
    },
    // parseItemRefs(state) {
    //   let flatAreas = state.areas.area.reduce((accum, area) => accum.concat(area.area), []);
    //   flatAreas.forEach( area => {
    //     area._refItems = new Array(0);

    //     if (area['item-ref'] && area['item-ref'].length) {
    //       area['item-ref'].forEach(itemRef => {
    //         if (state.itemMap[itemRef.$.addr] !== undefined &&
    //           (area.item && area.item.length ?
    //               area.item.find(item => item.$.addr == itemRef.$.addr) === undefined : true)) {
    //           area._refItems.push({
    //             ...(state.itemMap[itemRef.$.addr]),
    //           });
              
    //           // area._refItems[area._refItems.length - 1].$.name = itemRef.$.name;
    //         }
    //       });

    //       area.$._itemCount += area._refItems.filter(item => item.$.system != 'yes' && item.$.system != 'true').length;
    //     }
    //   })
    // },
    // selectRoom(state, id) {
    //   state.areas.area.forEach( area => {
    //     area.area.forEach( room => {
    //       if (room.$.id == id) {
    //         state.currentAreaData = area;
    //         state.currentRoomData = room;
    //       }
    //     })
    //   })
    // },
    setRoomDeviceStatuses(state, data) {
      let statusData = data.devices.reduce( (accum, item) => {
        // console.log('STATSUSES: ', item.addr, item.status);
        // console.log(item);
        if (!item.error && item.status != 'undefined') {
          accum[item.addr] = transformStatus(item.status);
        } else {
          console.error(item.error);
        }
        return accum;        
      }, {});

      for (let key in statusData) {
        if (state.itemMap[key].__.statusUpdateDisabled) {
          console.log('Disabled status update on', key);
          continue;
        }

        // state.itemMap[key].$._status = statusData[key];
        if (state.itemMap[key]) {
          // if (!state.itemMap[key].__) {
          //   Vue.set(state.itemMap[key], '__', {});
          // }
          Vue.set(state.itemMap[key].__, 'status', statusData[key]);
          
        } else {
          console.log('Not in ItemMap: ', key);
        }

        //  Update status in present controllers
        if (state.controllers[key]) state.controllers[key].updateStatus(statusData[key])
        
        //  Sensor devices notifications
        let watched = state.modules.watchedSensors.watchedSensorDevices[key];
        if (!watched || !watched.enableNotifications) {
          continue;
        } else {
          let type = state.itemMap[key].attributes.type;
          let val = sensorDeviceInterfaces[type].value(statusData[key]);
          
          if (watched.watchMin &&
              typeof watched.minThreshold == 'number' &&
              val <= watched.minThreshold) {
            console.log(`Device ${state.itemMap[key].attributes.name} (${key}) minimum alert!!!`);
            }

          if (watched.watchMax &&
            typeof watched.maxThreshold == 'number' &&
            val >= watched.maxThreshold) {
            console.log(`Device ${state.itemMap[key].attributes.name} (${key}) maximum alert!!!`);
          }
        }
      }

    },
    shiCodeResponse(state, data) {
      if (data && data.result) {
        let parsedSettings = parseSettingsString(data.result);
        let mappedSettings = mapSettings(parsedSettings);
        
        this.commit('modules/settings/setSettings', mappedSettings)
      }
    },


    //  Controllers
    saveController(state, controller) {
      Vue.set(state.controllers, controller.addr, controller);
      return controller;
    },
    saveSubscribedDevicesAddrs(state, payload) {
      if (!payload.addr || !payload.addr.length) payload.addr = [];

      if (payload.reset) {
        Vue.set(state, 'subscribedDevicesAddrs', payload.addr);
      } else {
        state.subscribedDevicesAddrs = state.subscribedDevicesAddrs.concat(payload.addr);
      }
    },
  },
  actions: {
    loadLogicXML({dispatch}) {
      const settings = JSON.parse(localStorage.getItem('settings'));
      const api = settings ? `${settings.network.remoteIp}:${settings.network.webPort}` : "95.84.154.146:15580" ;

      return axios.get(`http://${api}/MimiSetup/data/app.php/XmlEditor/getXml`)
      // axios.post(`http://${api}/logic/`)
        .then((response) => {
          localStorage.setItem('logic.xml', response.data)
          dispatch('parseAndSaveLogic', response.data);
          return true
        })
        .catch( (error) => {
          console.log(error);
          alert('Ошибка получения логики');
          return false
        })
    },
    async parseAndSaveLogic({ state, commit, getters }, payload) {
      let logic = parseAreasFromXML(payload);

      commit('saveLogic', logic);
      commit('flattenFloors')
      commit('setAreasIds')
      commit('createItemMap');
      // commit('parseItemRefs');
      commit('fillRoomsSensors')
      commit('setRoomsGroups', { getters });

      this.watch( () => state.modules.settings.interface.showSystem, () => {
        commit('setRoomsGroups', { getters });
      })
      // .then( ({ config, areas }) => {
      // commit('saveConfig', config);
      // commit('saveAreas', areas);
      // commit('createItemMap');
      // commit('parseItemRefs');
      // })
    },
    async loadLogic({ state, dispatch }) {
      if (!state.modules.settings.other.useTestLogic) {
        return this.dispatch('ws/sendMessage', { request: 'getLogic' });
      } else {
        return await fetch('/logic.xml')
          .then(res => res.text())
          .then(data => {
            return dispatch('parseAndSaveLogic', data);
          })
      }
    },

    subscribeOnStatuses() {},
    resubscribeOnStatuses({ state }) {
      console.log(state)
    },
    setStatus({ dispatch }, payload) {
      let { status, type } = payload;

      if (type && type === 'leak') {
        return dispatch ('ws/sendMessage', {
          request: 'set-state',
          addr: payload.addr,
          state: status.toString(),
          key: "1234567890123456"
        })
      }

      if (Array.isArray(status) || typeof status == 'number') {
        status = numberToByteString(status)
      } else if (typeof status != "string") {
        throw "setStatus invalid payload status!";
      }
      if (!payload.addr || !payload.addr.length) {
        throw "setStatus invalid payload addr!";
      }
      return dispatch ('ws/sendMessage', {
        request: 'set-state',
        addr: payload.addr,
        state: status,
        key: "1234567890123456"
      })
      // .then( (readyState) => {
      //   if (readyState == 3) {
      //     this._vm.$connect();
      //   }
      // })
    },
    changeItemXml({ dispatch }, item) {
      let newItem = {
        declaration: {
          attributes: {
            version: "1.0",
            encoding: "UTF-8"
          }
        },
        elements: [item]
      };

      let newItemXml = convert.js2xml(newItem, {
        spaces: '\t'
      });
      dispatch('ws/sendMessage', newItemXml);
    },
    changeGlobalXml({ state, dispatch }) {
      let newXml = convert.js2xml(state.logic, {
        spaces: '\t'
      });
      // console.log(newXml);
      dispatch('ws/sendMessage', newXml);
    }
  },
  modules: {
    ws,
    modules: {
      namespaced: true,
      modules: {
        popups,
        settings,
        watchedSensors,
        alerts,
        singleAction
      }
    }
  }
})
