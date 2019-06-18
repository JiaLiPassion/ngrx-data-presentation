import * as go from 'gojs';
import {
  createNodeTemplate,
  createLinkTemplate,
  createGroupTemplate,
  createTooltip,
  createContextMenu
} from './node-template';
import { initMenu } from './menu';
import { initTokens, initTokenMap } from './transition';
import { initCommandButtons } from './button';
import { resetLinkText } from './line';

let diagram: go.Diagram;

window.addEventListener('load', () => {
  initDiagram('myDiagramDiv');
});

window.addEventListener('unload', () => {
  if (diagram) {
    const data = diagram.model.toJson();
    console.log('data', data);
    window.localStorage.setItem('gojs.json', data);
  }
});

export function initDiagram(div: string) {
  const $ = go.GraphObject.make;
  diagram = $(go.Diagram, div, {
    'undoManager.isEnabled': true,
    // allow double-click in background to create a new node
    'clickCreatingTool.archetypeNodeData': { text: 'Node', color: 'white' },

    // allow Ctrl-G to call groupSelection()
    'commandHandler.archetypeGroupData': { text: 'Group', isGroup: true, color: 'blue' }
  });
  const foreLayer = diagram.findLayer('Foreground');
  const hiddenLayer = $(go.Layer, { name: 'hidden' });
  hiddenLayer.visible = false;
  diagram.addLayerBefore(hiddenLayer, foreLayer!);

  const partContextMenu = initMenu();
  diagram.nodeTemplate = createNodeTemplate(partContextMenu);
  diagram.linkTemplate = createLinkTemplate(partContextMenu);
  initTokenMap(diagram);
  diagram.groupTemplate = createGroupTemplate(partContextMenu);
  diagram.toolTip = createTooltip();
  diagram.contextMenu = createContextMenu();
  initData(diagram);
  resetLinkText(diagram);
  initCommandButtons(diagram);
  // initTokens(diagram);
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
