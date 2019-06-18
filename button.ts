import * as go from 'gojs';
import { setLinkText } from './line';
import { initTokens } from './transition';
export function initCommandButtons(diagram: go.Diagram) {
  const $ = go.GraphObject.make;
  diagram.add(
    $(
      go.Part,
      { locationSpot: go.Spot.Center, layerName: 'Foreground' },
      $(go.Shape, 'Rectangle', { fill: 'blue' }),
      $(
        go.Panel,
        'Vertical',
        { margin: 3 },
        $('Button', { margin: 2, click: startDispatch }, $(go.TextBlock, 'Dispatch!')),
        $(
          go.TextBlock,
          new go.Binding('text', 'clickCount', function(c) {
            return 'Clicked ' + c + ' times.';
          })
        )
      )
    )
  );
}

function startDispatch(e: any, obj: any) {
  const node = obj.part;
  setLinkText(node.diagram, 1, 2, 'Dispatch');
  initTokens(node.diagram);
}
