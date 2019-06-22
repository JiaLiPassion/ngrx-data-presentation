export function findNode(diagram: go.Diagram, nodeKey: number) {
  let result: any = null;
  diagram.nodes.each(node => {
    if (node.data && node.data.key === nodeKey) {
      result = node;
    }
  });
  return result;
}
