export function setLinkText(diagram: go.Diagram, linkFrom: number, linkTo: number, text: string) {
  let result: go.Link | null = null;
  diagram.links.each(link => {
    if (link.data && link.data.from === linkFrom && link.data.to === linkTo) {
      result = link;
    }
  });
  if (result) {
    diagram.model.setDataProperty(result!.data, 'text', text);
  }
}

export function resetLinkText(diagram: go.Diagram) {
  diagram.links.each(link => {
    if (link.data) {
      diagram.model.setDataProperty(link.data, 'text', '');
    }
  });
}
