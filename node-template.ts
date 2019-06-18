import * as go from 'gojs';

// To simplify this code we define a function for creating a context menu button:
export function makeButton(text: string, action: any, visiblePredicate?: any) {
  const $ = go.GraphObject.make;
  return $(
    'ContextMenuButton',
    $(go.TextBlock, text),
    { click: action },
    // don't bother with binding GraphObject.visible if there's no predicate
    visiblePredicate
      ? new go.Binding('visible', '', function(o, e) {
          return o.diagram ? visiblePredicate(o, e) : false;
        }).ofObject()
      : {}
  );
}

export function nodeInfo(d: any) {
  // Tooltip info for a node data object
  var str = 'Node ' + d.key + ': ' + d.text + '\n';
  if (d.group) str += 'member of ' + d.group;
  else str += 'top-level node';
  return str;
}

// These nodes have text surrounded by a rounded rectangle
// whose fill color is bound to the node data.
// The user can drag a node by dragging its TextBlock label.
// Dragging from the Shape will start drawing a new link.
export function createNodeTemplate(partContextMenu: any) {
  const $ = go.GraphObject.make;
  return $(
    go.Node,
    'Auto',
    [
      { locationSpot: go.Spot.Center, resizable: true },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
    ],
    $(
      go.Shape,
      'RoundedRectangle',
      {
        fill: 'white', // the default fill, if there is no data bound value
        portId: '',
        cursor: 'pointer', // the Shape is the port, not the whole Node
        // allow all kinds of links from and to this port
        fromLinkable: true,
        fromLinkableSelfNode: true,
        fromLinkableDuplicates: true,
        toLinkable: true,
        toLinkableSelfNode: true,
        toLinkableDuplicates: true
      },
      new go.Binding('fill', 'color')
    ),
    $(
      go.TextBlock,
      {
        font: 'bold 24px sans-serif',
        stroke: '#333',
        margin: 6, // make some extra space for the shape around the text
        isMultiline: false, // don't allow newlines in text
        editable: true // allow in-place editing by user
      },
      new go.Binding('text', 'text').makeTwoWay()
    ), // the label shows the node data's text
    {
      // this tooltip Adornment is shared by all nodes
      toolTip: $(
        'ToolTip',
        $(
          go.TextBlock,
          { margin: 4 }, // the tooltip shows the result of calling nodeInfo(data)
          new go.Binding('text', '', nodeInfo)
        )
      ),
      // this context menu Adornment is shared by all nodes
      contextMenu: partContextMenu,
      selectionChanged: function(p: any) {
        if (p.data.text === 'gray') {
          p.layerName = 'gray';
          p.data.color = 'gray';
          const layer = p.diagram.findLayer('gray');
          if (layer) {
            layer.opacity = 0.8;
          }
        }
        console.log('p is selected', p.data);
      }
    }
  );
}
// Define the appearance and behavior for Links:

export function linkInfo(d: any) {
  // Tooltip info for a link data object
  return 'Link:\nfrom ' + d.from + ' to ' + d.to;
}

// The link shape and arrowhead have their stroke brush data bound to the "color" property
export function createLinkTemplate(partContextMenu: any) {
  const $ = go.GraphObject.make;
  return $(
    go.Link,
    { toShortLength: 3, relinkableFrom: true, relinkableTo: true }, // allow the user to relink existing links
    $(go.Shape, { strokeWidth: 2 }, new go.Binding('stroke', 'color')),
    $(go.Shape, { toArrow: 'Standard', stroke: null }, new go.Binding('fill', 'color')),
    $(
      go.Panel,
      'Auto',
      $(
        go.Shape, // the label background, which becomes transparent around the edges
        {
          fill: $(go.Brush, 'Radial', {
            0: 'rgb(240, 240, 240)',
            0.3: 'rgb(240, 240, 240)',
            1: 'rgba(240, 240, 240, 0)'
          }),
          stroke: null
        }
      ),
      $(
        go.TextBlock, // the label text
        {
          textAlign: 'center',
          font: '10pt helvetica, arial, sans-serif',
          stroke: '#555555',
          margin: 4,
          editable: true
        },
        new go.Binding('text', 'text')
      )
    ),
    {
      // this tooltip Adornment is shared by all links
      toolTip: $(
        'ToolTip',
        $(
          go.TextBlock,
          { margin: 4 }, // the tooltip shows the result of calling linkInfo(data)
          new go.Binding('text', '', linkInfo)
        )
      ),
      // the same context menu Adornment is shared by all links
      contextMenu: partContextMenu
    }
  );
}
// Define the appearance and behavior for Groups:

export function groupInfo(adornment: any) {
  // takes the tooltip or context menu, not a group node data object
  var g = adornment.adornedPart; // get the Group that the tooltip adorns
  var mems = g.memberParts.count;
  var links = 0;
  g.memberParts.each(function(part: any) {
    if (part instanceof go.Link) links++;
  });
  return (
    'Group ' +
    g.data.key +
    ': ' +
    g.data.text +
    '\n' +
    mems +
    ' members including ' +
    links +
    ' links'
  );
}

// Groups consist of a title in the color given by the group node data
// above a translucent gray rectangle surrounding the member parts
export function createGroupTemplate(partContextMenu: any) {
  const $ = go.GraphObject.make;
  return $(
    go.Group,
    'Vertical',
    [
      {
        selectionObjectName: 'PANEL', // selection handle goes around shape, not label
        ungroupable: true, // enable Ctrl-Shift-G to ungroup a selected Group,
        resizable: true,
        resizeObjectName: 'PANEL'
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify)
    ],
    $(
      go.TextBlock,
      {
        font: 'bold 19px sans-serif',
        isMultiline: false, // don't allow newlines in text
        editable: true // allow in-place editing by user
      },
      new go.Binding('text', 'text').makeTwoWay(),
      new go.Binding('stroke', 'color')
    ),
    $(
      go.Panel,
      'Auto',
      [{ name: 'PANEL' }],
      $(
        go.Shape,
        'Rectangle', // the rectangular shape around the members
        {
          fill: 'rgba(128,128,128,0.2)',
          stroke: 'gray',
          strokeWidth: 3,
          portId: '',
          cursor: 'pointer', // the Shape is the port, not the whole Node
          // allow all kinds of links from and to this port
          fromLinkable: true,
          fromLinkableSelfNode: true,
          fromLinkableDuplicates: true,
          toLinkable: true,
          toLinkableSelfNode: true,
          toLinkableDuplicates: true
        }
      ),
      $(go.Placeholder, { margin: 10, background: 'transparent' }) // represents where the members are
    ),
    {
      // this tooltip Adornment is shared by all groups
      toolTip: $(
        'ToolTip',
        $(
          go.TextBlock,
          { margin: 4 },
          // bind to tooltip, not to Group.data, to allow access to Group properties
          new go.Binding('text', '', groupInfo).ofObject()
        )
      ),
      // the same context menu Adornment is shared by all groups
      contextMenu: partContextMenu
    }
  );
}
// Define the behavior for the Diagram background:

export function diagramInfo(model: any) {
  // Tooltip info for the diagram's model
  return (
    'Model:\n' + model.nodeDataArray.length + ' nodes, ' + model.linkDataArray.length + ' links'
  );
}

// provide a tooltip for the background of the Diagram, when not over any Part
export function createTooltip() {
  const $ = go.GraphObject.make;
  return $('ToolTip', $(go.TextBlock, { margin: 4 }, new go.Binding('text', '', diagramInfo)));
}

// provide a context menu for the background of the Diagram, when not over any Part
export function createContextMenu() {
  const $ = go.GraphObject.make;
  return $(
    'ContextMenu',
    makeButton(
      'Paste',
      function(e: any, obj: any) {
        e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint);
      },
      function(o: any) {
        return o.diagram.commandHandler.canPasteSelection();
      }
    ),
    makeButton(
      'Undo',
      function(e: any, obj: any) {
        e.diagram.commandHandler.undo();
      },
      function(o: any) {
        return o.diagram.commandHandler.canUndo();
      }
    ),
    makeButton(
      'Redo',
      function(e: any, obj: any) {
        e.diagram.commandHandler.redo();
      },
      function(o: any) {
        return o.diagram.commandHandler.canRedo();
      }
    ),
    makeButton(
      'Save',
      function(e: any, obj: any) {
        const data = e.diagram.model.toJson();
        console.log('data', data);
        window.localStorage.setItem('gojs.json', data);
      },
      function(o: any) {
        return true;
      }
    )
  );
}
