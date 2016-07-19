import {
    EMBER_INSPECTOR, REACT_DEVELOPER_TOOLS,
    BACKBONE_DEBUGGER, JQUERY_DEBUGGER,
    ANGULARJS_BATARANG, VUEJS_DEVTOOLS,
    REDUX_DEVTOOLS, REACT_PERF,
  }
  from '../../src/';

const knownExtensions = [
  {
    id: EMBER_INSPECTOR,
    description: 'Ember Inspector',
  },
  {
    id: REACT_DEVELOPER_TOOLS,
    description: 'React Developer Tools',
  },
  {
    id: BACKBONE_DEBUGGER,
    description: 'Backbone Debugger',
  },
  {
    id: JQUERY_DEBUGGER,
    description: 'jQuery Debugger',
  },
  {
    id: ANGULARJS_BATARANG,
    description: 'AngularJS Batarang',
  },
  {
    id: VUEJS_DEVTOOLS,
    description: 'Vue.js devtools',
  },
  {
    id: REDUX_DEVTOOLS,
    description: 'Redux DevTools',
  },
  {
    id: REACT_PERF,
    description: 'React Perf',
  },
];

export default knownExtensions;
