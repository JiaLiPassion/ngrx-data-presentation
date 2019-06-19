import * as go from 'gojs';
import { setLinkText } from './line';
import { initTokens } from './transition';
import { resetColors } from './color';
export function initCommandButtons(diagram: go.Diagram) {
  const dispatchPart = createButton(diagram, 'Dispatch', startDispatch);
  dispatchPart.location = new go.Point(-100, -200);
  const resetColorPart = createButton(diagram, 'Reset Colors', () => resetColors(diagram));
  resetColorPart.location = new go.Point(0, -200);
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

function startDispatch(e: any, obj: any) {
  const node = obj.part;
  setLinkText(node.diagram, 1, 2, 'Dispatch');
  initTokens(node.diagram);
}
