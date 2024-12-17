import {
  EMBER_INSPECTOR,
  REACT_DEVELOPER_TOOLS,
  BACKBONE_DEBUGGER,
  JQUERY_DEBUGGER,
  VUEJS_DEVTOOLS,
  VUEJS3_DEVTOOLS,
  REDUX_DEVTOOLS,
  MOBX_DEVTOOLS,
} from '../../src/';

const knownExtensions = [
  {
    ...EMBER_INSPECTOR,
    description: 'Ember Inspector',
  },
  {
    ...REACT_DEVELOPER_TOOLS,
    description: 'React Developer Tools',
  },
  {
    ...BACKBONE_DEBUGGER,
    description: 'Backbone Debugger',
  },
  {
    ...JQUERY_DEBUGGER,
    description: 'jQuery Debugger',
  },
  {
    ...VUEJS_DEVTOOLS,
    description: 'Vue.js devtools',
  },
  {
    ...VUEJS3_DEVTOOLS,
    description: 'Vue.js devtools (beta)',
  },
  {
    ...REDUX_DEVTOOLS,
    description: 'Redux DevTools',
  },
  {
    ...MOBX_DEVTOOLS,
    description: 'MobX Developer Tools',
  },
];

export default knownExtensions;
