import {
    EMBER_INSPECTOR, REACT_DEVELOPER_TOOLS,
    BACKBONE_DEBUGGER, JQUERY_DEBUGGER,
    ANGULARJS_BATARANG, VUEJS_DEVTOOLS,
    REDUX_DEVTOOLS, REACT_PERF,
    CYCLEJS_DEVTOOL,
  }
  from '../../src/';

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
    ...ANGULARJS_BATARANG,
    description: 'AngularJS Batarang',
  },
  {
    ...VUEJS_DEVTOOLS,
    description: 'Vue.js devtools',
  },
  {
    ...REDUX_DEVTOOLS,
    description: 'Redux DevTools',
  },
  {
    ...REACT_PERF,
    description: 'React Perf',
  },
  {
    ...CYCLEJS_DEVTOOL,
    description: 'Cycle.js',
  },
];

export default knownExtensions;
