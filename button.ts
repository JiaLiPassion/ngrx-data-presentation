import * as go from 'gojs';
import { setLinkText, resetLinkText, findLink } from './line';
import { initTokens } from './transition';
import { resetColors } from './color';
import traditional from './demodata/traditional.json';
import traditionalTransition from './demodata/traditional-transition.json';
import ngrx from './demodata/ngrx-data.json';
import { findNode } from './node';
export function initCommandButtons(diagram: go.Diagram) {
  const traditionalPart = createLoadDataButton(
    diagram,
    'Traditional',
    JSON.stringify(traditional),
    traditionalTransition
  );
  const ngrxPart = createLoadDataButton(diagram, 'ngrx', JSON.stringify(ngrx), []);
  const resetColorPart = createButton(diagram, 'Reset Colors', () => resetColors(diagram));
  let idx = 0;
  [traditionalPart, ngrxPart, resetColorPart].forEach(part => {
    part.location = new go.Point(-100 + idx++ * 100, -200);
  });
}

function setLinkAndMove(diagram: go.Diagram, tran: any, callback: any) {
  resetLinkText(diagram);
  if (tran.link.data) {
    // setDevToolText(diagram, tran.link.data);
    const link = findLink(diagram, tran.link.from, tran.link.to);
    if (link) {
      diagram.model.setDataProperty(
        link.data,
        'tooltip',
        JSON.stringify(tran.link.data, null, '\u00AD  ')
      );
      const target = findNode(diagram, tran.link.to);
      if (target) {
        diagram.model.setDataProperty(
          target.data,
          'tooltip',
          JSON.stringify(tran.link.data, null, '\u00AD  ')
        );
      }
    }
  }
  setLinkText(
    diagram,
    tran.link.from,
    tran.link.to,
    tran.link.text,
    tran.link.reverse ? '#00ff00' : '#ffff00'
  );
  initTokens(diagram, tran.link.from, tran.link.to, callback);
}

export function loadAndStartTransition(
  diagram: go.Diagram,
  json: string,
  transitions: any,
  autoStart = true,
  transitionIdx = -1
) {
  if (transitionIdx === -1) {
    diagram.model = go.Model.fromJson(json);
    resetLinkText(diagram);
    if (!autoStart) {
      return 0;
    }
  }
  if (autoStart) {
    setTimeout(() => {
      let promise: any = null;
      for (let i = 0; i < transitions.length; i++) {
        if (!promise) {
          promise = new Promise(res => setLinkAndMove(diagram, transitions[i], res));
        } else {
          promise = promise.then(
            (_: any) => new Promise(res => setLinkAndMove(diagram, transitions[i], res))
          );
        }
      }
    }, 500);
  } else {
    if (transitionIdx < transitions.length) {
      setLinkAndMove(diagram, transitions[transitionIdx], () => {});
      return transitionIdx + 1;
    }
    return 0;
  }
}

function createLoadDataButton(diagram: go.Diagram, text: string, json: string, transitions: any) {
  return createButton(diagram, text, () => {
    loadAndStartTransition(diagram, json, transitions);
  });
}

function createButton(diagram: go.Diagram, text: string, callback: any) {
  const $ = go.GraphObject.make;

  const part = $(
    go.Part,
    [
      {
        locationSpot: go.Spot.Center,
        layerName: 'Foreground',
        resizable: true,
        resizeObjectName: 'PANEL'
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
    ],
    $(go.Shape, 'Rectangle', { fill: null, stroke: null }),
    $(
      go.Panel,
      'Vertical',
      { margin: 3, name: 'PANEL' },
      $('Button', { margin: 2, click: callback }, $(go.TextBlock, text))
    )
  );
  diagram.add(part);
  return part;
}

// export function setDevToolText(diagram: go.Diagram, obj: any) {
//   let devTool: any;
//   diagram.nodes.each(node => {
//     if (node.data && node.data.tag === 'DevTool') {
//       devTool = node;
//     }
//   });
//   if (devTool) {
//     diagram.model.setDataProperty(devTool.data, 'text', JSON.stringify(obj, null, '  '));
//   }
// }
