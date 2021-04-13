/**
 * 获取子节点组成的数组
 * @param target
 * @param parent
 */
export const getChildNodesArray = (
  target: string,
  parent: string,
): Array<Node> => {
  const tempParent = document.createElement(parent);
  tempParent.innerHTML = target;

  return [].slice.call(tempParent.childNodes);
};
