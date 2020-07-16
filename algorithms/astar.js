async function astar(beginNode, endNode){
  const frontier = [];
  const parent = new Map();
  let neighbours = [];
  let node = {
    row: beginNode.row,
    col: beginNode.col,
    heuristic: manhattan(beginNode.row, beginNode.col),
    cost: 0
  };
  
  frontier.push(node);
  while (frontier.length > 0 && running) {
    node = frontier.shift();
    // if node is not start/end node, mark as visited
    if (nodes[node.row][node.col].state != STATE.START && nodes[node.row][node.col].state != STATE.FINISH) {
      nodes[node.row][node.col].state = STATE.VISITED;
    }
    // if found, draw its path and return
    if(node.row == endNode.row && node.col == endNode.col){
      await drawPath(parent, endNode);
      return;
    } else {
      neighbours = findNeighbours(node);
      neighbours.forEach(newNode => {
        // check if node already exists in frontier
        let found = -1;
        for(let i = 0; i < frontier.length; i++) {
          if (frontier[i].row == newNode.row && frontier[i].col == newNode.col) {
            found = i;
            break;
          }
        }

        // if not in frontier / visited nodes, add it
        newNode.cost = node.cost + 1;
        newNode.heuristic = manhattan(newNode.row, newNode.col) + newNode.cost;
        if(found == -1 && !parent.has(`${newNode.row},${newNode.col}`)){
          frontier.push(newNode);
          parent.set(`${newNode.row},${newNode.col}`, node);
        } else if (found >= 0) { // decrease key otherwise
          if (newNode.heuristic < frontier[found].heuristic) {
            parent.set(`${newNode.row},${newNode.col}`, node);
            frontier[found] = newNode;
          }
        }
      });
      frontier.sort((a, b) => a.heuristic - b.heuristic);
    }
    await sleep(speed);
  }

  if (running)
    return -1;
  else
    return -2;
}
