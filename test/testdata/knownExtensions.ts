import {
  EMBER_INSPECTOR,
  REACT_DEVELOPER_TOOLS,
  BACKBONE_DEBUGGER,
  JQUERY_DEBUGGER,
  ANGULAR_DEVTOOLS,
  VUEJS_DEVTOOLS,
  VUEJS3_DEVTOOLS,
  REDUX_DEVTOOLS,
  CYCLEJS_DEVTOOL,
  APOLLO_DEVELOPER_TOOLS,
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
    ...ANGULAR_DEVTOOLS,
    description: 'Angular DevTools',
  },
  {
    ...VUEJS_DEVTOOLS,
    description: 'Vue.js devtools',
  },
  {
    ...VUEJS3_DEVTOOLS,
    description: 'Vue.js devtools',
  },
  {
    ...REDUX_DEVTOOLS,
    description: 'Redux DevTools',
  },
  {
    ...CYCLEJS_DEVTOOL,
    description: 'Cycle.js',
  },
  // {
  //   ...APOLLO_DEVELOPER_TOOLS,
  //   description: 'Apollo Client Developer Tools',
  // },
  {
    ...MOBX_DEVTOOLS,
    description: 'MobX Developer Tools',
  },
];

export default knownExtensions;
