import * as go from 'gojs';
import { makeButton, linkInfo, groupInfo, nodeInfo } from './node-template';
export function initMenu() {
  const $ = go.GraphObject.make;
  // a context menu is an Adornment with a bunch of buttons in them
  return $(
    'ContextMenu',
    makeButton('Properties', function(e: any, obj: any) {
      // OBJ is this Button
      var contextmenu = obj.part; // the Button is in the context menu Adornment
      var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
      // now can do something with PART, or with its data, or with the Adornment (the context menu)
      if (part instanceof go.Link) alert(linkInfo(part.data));
      else if (part instanceof go.Group) alert(groupInfo(contextmenu));
      else alert(nodeInfo(part.data));
    }),
    makeButton(
      'Cut',
      function(e: any, obj: any) {
        e.diagram.commandHandler.cutSelection();
      },
      function(o: any) {
        return o.diagram.commandHandler.canCutSelection();
      }
    ),
    makeButton(
      'Copy',
      function(e: any, obj: any) {
        e.diagram.commandHandler.copySelection();
      },
      function(o: any) {
        return o.diagram.commandHandler.canCopySelection();
      }
    ),
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
      'Delete',
      function(e: any, obj: any) {
        e.diagram.commandHandler.deleteSelection();
      },
      function(o: any) {
        return o.diagram.commandHandler.canDeleteSelection();
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
      'Group',
      function(e: any, obj: any) {
        e.diagram.commandHandler.groupSelection();
      },
      function(o: any) {
        return o.diagram.commandHandler.canGroupSelection();
      }
    ),
    makeButton(
      'Ungroup',
      function(e: any, obj: any) {
        e.diagram.commandHandler.ungroupSelection();
      },
      function(o: any) {
        return o.diagram.commandHandler.canUngroupSelection();
      }
    )
  );
}
