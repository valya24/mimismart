export const JALOUSIE_CLOSED = 0;
export const JALOUSIE_OPEN = 1;
export const JALOUSIE_CLOSING = 2;
export const JALOUSIE_OPENING = 3;
export const JALOUSIE_HALFOPEN = 4;

export const JALOUSIE_STATES = {
  JALOUSIE_CLOSED,
  JALOUSIE_OPEN,
  JALOUSIE_CLOSING,
  JALOUSIE_OPENING,
  JALOUSIE_HALFOPEN
};

//  Conditioner vanes states

export const VANE_HOR_LEFT_1 = 0;
export const VANE_HOR_LEFT_2 = 1;
export const VANE_HOR_MIDDLE = 2;
export const VANE_HOR_RIGHT_1 = 3;
export const VANE_HOR_RIGHT_2 = 4;
export const VANE_HOR_LEFT_AND_RIGHT = 5;
export const VANE_HOR_ALL = 6;

export const VANE_HOR_STATES = {
  VANE_HOR_LEFT_1,
  VANE_HOR_LEFT_2,
  VANE_HOR_MIDDLE,
  VANE_HOR_RIGHT_1,
  VANE_HOR_RIGHT_2,
  VANE_HOR_LEFT_AND_RIGHT,
  VANE_HOR_ALL,
};

export const VANE_VER_NONE = 0;
export const VANE_VER_TOP_1 = 1;
export const VANE_VER_TOP_2 = 2;
export const VANE_VER_MIDDLE = 3;
export const VANE_VER_BOTTOM_1 = 4;
export const VANE_VER_BOTTOM_2 = 6;
export const VANE_VER_ALL = 5;

export const VANE_VER_STATES = {
  VANE_VER_NONE,
  VANE_VER_TOP_1,
  VANE_VER_TOP_2,
  VANE_VER_MIDDLE,
  VANE_VER_BOTTOM_1,
  VANE_VER_BOTTOM_2,
  VANE_VER_ALL,
};

export const SYSTEM_ICONS = [
  'wifi-off',
  'wifi-on',
  'cloud-off',
  'cloud-on',
  'globe-off',
  'globe-on',
  'user',
  'mute',
  'off',
  'auto',
  'home',
  'home-f',
  'favs',
  'settings',
  'notifications',
  'rooms',
  'close',
  'cross',
  'more',
  'check',
  'plus',
  'minus',

  'play',
  'pause',
  'play-prev',
  'play-next',
  'just1',
  'loop-just1',
  'shuffle',
  'intro',

  'comp'
];

export const groups = {
  'scenarios': {
    name: 'Scenarios',
    icon: 'script',
    types: ['script', 'import-script', 'light-scheme'],
  },
  'lights': {
    name: 'Lights',
    icon: 'lamp',
    types: ['lamp', 'dimer-lamp', 'rgb-lamp'],
  },
  'shades': {
    name: 'Shades',
    icon: 'jalousie',
    types: ['jalousie', 'jalousie120', '120'],
  },
  'climate': {
    name: 'Climate',
    icon: 'climate-control',
    types: ['valve-heating', 'conditioner', 'ventilation'],
  },
  'security': {
    name: 'Security',
    icon: 'security',
    types: ['valve', 'camera', 'rtsp', 'intercom', 'gate', 'security-card-reader'],
  },
  'sensors': {
    name: 'Sensors',
    icon: 'sensor-amps',
    types: ['sensor', 'motion-sensor', 'illumination-sensor', 'temperature-sensor', 'humidity-sensor', 'door-sensor', 'leak-sensor', 'co2-sensor', 'virtual', 'text', 'long-text', 'RS232', 'RS485'],
  },
  'other': {
    name: 'Other',
    icon: 'other-devices',
    types: ['switch', 'ir-receiver', 'ir-transmitter', 'remote-control'],
  },
  'music': {
    name: 'Music',
    icon: 'multiroom',
    types: ['multiroom', 'speaker'],
  },
}

export const hiddenItemTypes = [
  'camera', 'rtsp', 'intercom', 'security-card-reader',
  'RS232', 'RS485',
  'ir-receiver', 'ir-transmitter', 'remote-control',
  'multiroom', 'speaker'
]

export const ROOT_PASSWORD = '3709';

export const SETTINGS_MAP = {
  'srv-addr': 'network.localIp',
  'srv-addr-remote': 'network.remoteIp',
  'pass-key': 'network.key',
  'mode-is-remote': 'network.remoteMode'
}

export const CO2_LEVEL_YELLOW = 800;
export const CO2_LEVEL_RED = 2000;
