import * as go from 'gojs';
import {
  createNodeTemplate,
  createLinkTemplate,
  createGroupTemplate,
  createTooltip,
  createContextMenu,
  createTwoWayLinkTemplate,
  createLeftAlignLinkTemplate
} from './node-template';
import { initMenu } from './menu';
import { loadAndStartTransition } from './button';
import traditional from './demodata/traditional.json';
import traditionalTransition from './demodata/traditional-transition.json';
import ngrx from './demodata/ngrx.json';
import ngrxTransition from './demodata/ngrx-transition.json';
import ngrxData from './demodata/ngrx-data.json';
import ngrxDataTransition from './demodata/ngrx-data-transition.json';
import ngrxHidden from './demodata/ngrx-hidden.json';
import ngrxGetAll from './demodata/ngrx-data-getall.json';
import ngrxGetAllTransition from './demodata/ngrx-data-getall.transition.json';
import ngrxDataEntity from './demodata/ngrx-data-entity.json';
import ngrxDataExtension from './demodata/ngrx-data-extension.json';
import ngrxDataPage from './demodata/ngrx-data-page.json';
import ngrxDataPageTransition from './demodata/ngrx-data-page.transition.json';

let diagram: go.Diagram;
const dataMap: any = {
  traditional: {
    diagram: traditional,
    transitions: traditionalTransition
  },
  ngrx: {
    diagram: ngrx,
    transitions: ngrxTransition
  },
  ngrxHidden: {
    diagram: ngrxHidden,
    transitions: []
  },
  ngrxData: {
    diagram: ngrxData,
    transitions: ngrxDataTransition
  },
  ngrxDataGetAll: {
    diagram: ngrxGetAll,
    transitions: ngrxGetAllTransition
  },
  ngrxDataEntity: {
    diagram: ngrxDataEntity,
    transitions: []
  },
  ngrxDataExtension: {
    diagram: ngrxDataExtension,
    transitions: []
  },
  ngrxDataPage: {
    diagram: ngrxDataPage,
    transitions: ngrxDataPageTransition
  }
};

window.addEventListener('load', () => {
  initDiagram('myDiagramDiv');
  const urlParams = new URLSearchParams(window.location.search);
  const autoStart = urlParams.get('auto') === 'true';
  const program = urlParams.get('program');
  if (!program) {
    return;
  }
  const data = dataMap[program];
  if (!data) {
    return;
  }
  if (autoStart) {
    loadAndStartTransition(diagram, data.diagram, data.transitions, true);
  }
  let idx: any = autoStart ? 0 : -1;
  if (!autoStart) {
    idx = loadAndStartTransition(diagram, data.diagram, data.transitions, false, idx);
  }
  document.addEventListener('keypress', (ev: KeyboardEvent) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      idx = loadAndStartTransition(diagram, data.diagram, data.transitions, false, idx);
    }
  });
});

export function initDiagram(div: string) {
  const $ = go.GraphObject.make;
  diagram = $(go.Diagram, div, {
    'undoManager.isEnabled': true,
    'toolManager.toolTipDuration': 10000,
    // allow double-click in background to create a new node
    'clickCreatingTool.archetypeNodeData': { text: 'Node', color: 'white' },

    // allow Ctrl-G to call groupSelection()
    'commandHandler.archetypeGroupData': { text: 'Group', isGroup: true, color: 'blue' }
  });
  const foreLayer = diagram.findLayer('Foreground');

  const partContextMenu = initMenu();
  diagram.nodeTemplate = createNodeTemplate(partContextMenu);
  const linkTemp = createLinkTemplate(partContextMenu);
  const linkTwowayTemp = createTwoWayLinkTemplate(partContextMenu);
  const linkLeftTemp = createLeftAlignLinkTemplate(partContextMenu);
  const tempMap: any = new go.Map();
  tempMap.add('', linkTemp);
  tempMap.add('two', linkTwowayTemp);
  tempMap.add('left', linkLeftTemp);
  diagram.linkTemplateMap = tempMap;
  // initTokenMap(diagram);
  diagram.groupTemplate = createGroupTemplate(partContextMenu);
  diagram.toolTip = createTooltip();
  diagram.contextMenu = createContextMenu();
  // initData(diagram);
  // resetLinkText(diagram);
  // initCommandButtons(diagram);

  const hiddenLayer = $(go.Layer, { name: 'hidden' });
  hiddenLayer.opacity = 0.8;
  hiddenLayer.visible = false;
  diagram.addLayerBefore(hiddenLayer, foreLayer!);
  diagram.nodes.each(node => {
    if (node.data.text === 'gray') {
      node.layerName = 'hidden';
    }
  });
}

export function initData(diagram: go.Diagram) {
  const data = window.localStorage.getItem('gojs.json');
  if (data) {
    diagram.model = go.Model.fromJson(data);
  } else {
    const nodeDataArray = [
      { key: 1, text: 'View', color: 'lightblue' },
      { key: 2, text: 'EntityService', color: 'orange' },
      { key: 3, text: 'Gamma', color: 'lightgreen', group: 5 },
      { key: 4, text: 'Delta', color: 'pink', group: 5 },
      { key: 5, text: 'Epsilon', color: 'green', isGroup: true }
    ];
    const linkDataArray = [
      { from: 1, to: 2, color: 'blue' },
      { from: 2, to: 2 },
      { from: 3, to: 4, color: 'green' },
      { from: 3, to: 1, color: 'purple' }
    ];
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  }
}
