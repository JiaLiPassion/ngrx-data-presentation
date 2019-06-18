import * as go from 'gojs';
let indicator: go.Part;

export function initTokenMap(diagram: go.Diagram) {
  const $ = go.GraphObject.make;
  indicator = $(
    go.Part,
    { locationSpot: go.Spot.Center, layerName: 'Foreground' },
    $(
      go.Shape,
      'Circle',
      { width: 12, height: 12, fill: 'green', strokeWidth: 0 },
      new go.Binding('fill', 'color')
    )
  );
  diagram.add(indicator);
  // indicator.location = new go.Point(-500, -500);
}

export function initTokens(diagram: go.Diagram) {
  const oldskips = diagram.skipsUndoManager;
  diagram.skipsUndoManager = true;
  // diagram.model.addNodeDataCollection([{ category: 'token', at: 1, color: 'green' }]);
  diagram.skipsUndoManager = oldskips;
  // resetTokens(diagram);
  window.requestAnimationFrame(() => {
    updateTokens(diagram, 1);
  });
}

function updateTokens(diagram: go.Diagram, nodeKey: number) {
  const oldskips = diagram.skipsUndoManager;
  diagram.skipsUndoManager = true; // don't record these changes in the UndoManager!
  const temp = new go.Point();
  let hasDest = false;
  diagram.nodes.each(function(node) {
    if (node.key !== nodeKey) {
      return;
    }
    const from = node;
    if (from === null) return;
    const data = from.data;
    let frac = data.frac;
    if (frac === undefined) frac = 0.0;
    const next = data.next;
    const to = diagram.findNodeForKey(next);
    if (to === null) {
      // nowhere to go?
      positionTokenAtNode(indicator, from); // temporarily stay at the current node
      data.next = chooseDestination(diagram, node, from); // and decide where to go next
      hasDest = true;
    } else {
      // proceed toward the "to" port
      const link = from.findLinksTo(to).first();
      if (link) {
        indicator.location = link.path!.getDocumentPoint(
          link.path!.geometry!.getPointAlongPath(frac, temp)
        );
        hasDest = true;
      } else {
        // stay at the current node
        positionTokenAtNode(indicator, from);
      }
      if (frac >= 1.0) {
        // if beyond the end, it's "AT" the NEXT node
        data.frac = 0.0;
        data.at = next;
        data.next = undefined; // don't know where to go next
        hasDest = false;
      } else {
        // otherwise, move fractionally closer to the NEXT node
        data.frac = frac + 0.01;
      }
    }
  });
  diagram.skipsUndoManager = oldskips;
  if (hasDest) {
    window.requestAnimationFrame(() => {
      updateTokens(diagram, nodeKey);
    });
  }
}

// determine where to position a token when it is resting at a node
function positionTokenAtNode(token: any, node: any) {
  // these details depend on the node template
  token.location = node.position.copy().offset(4 + 6, 5 + 6);
}

function chooseDestination(diagram: go.Diagram, token: any, node: any) {
  const dests = new go.List().addAll(node.findNodesOutOf());
  if (dests.count > 0) {
    const dest: any = dests.elt(Math.floor(Math.random() * dests.count));
    return dest.data.key;
  }
  const arr = diagram.model.nodeDataArray;
  // choose a random next data object that is not a token and is not the current Node
  let data = null;
  while (
    ((data = arr[Math.floor(Math.random() * arr.length)]),
    data.category === 'token' || data === node.data)
  ) {}
  return data.key;
}
