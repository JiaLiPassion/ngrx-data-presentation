import { invertColor } from './color';

export function setLinkText(
  diagram: go.Diagram,
  linkFrom: number,
  linkTo: number,
  text: string,
  color = '#ffff00'
) {
  const result = findLink(diagram, linkFrom, linkTo);
  if (result) {
    diagram.model.setDataProperty(result!.data, 'text', text);
    diagram.model.setDataProperty(result!.data, 'textFill', color);
    diagram.model.setDataProperty(result!.data, 'color', invertColor(color, true));
  }
}

export function findLink(diagram: go.Diagram, from: number, to: number) {
  let result: any = null;
  diagram.links.each(link => {
    if (link.data && link.data.from === from && link.data.to === to) {
      result = link;
    }
  });
  return result;
}

export function resetLinkText(diagram: go.Diagram) {
  diagram.links.each(link => {
    if (link.data) {
      diagram.model.setDataProperty(link.data, 'text', '');
      diagram.model.setDataProperty(link.data, 'textFill', null);
    }
  });
}
