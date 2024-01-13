const graph = {
    S: { G: 9, A: 2, B: 1 },
    A: { C: 2, D: 3 },
    B: { D: 2, E: 4 },
    C: { G: 4 },
    D: { G: 4 },
    E: {},
    G: {}
  };

  function getHeuristic(node) {

    const heuristicValues = { 
        S: 6, 
        A: 0, 
        B: 6, 
        C: 4, 
        D: 1, 
        E: 10, 
        G: 0 
    };

    return heuristicValues[node];
  }

  const startNode = 'S';
  const goalNode = 'G';

  function dfs(graph, start, goal, visited = new Set()) {
    if (start === goal) {
      return { path: [start], cost: 0 };
    }

    visited.add(start);

    for (const neighbor in graph[start]) {
      if (!visited.has(neighbor)) {
        const result = dfs(graph, neighbor, goal, visited);
        if (result.path.length > 0) {
          result.path.unshift(start);
          result.cost += graph[start][neighbor];
          return result;
        }
      }
    }

    return { path: [], cost: Infinity };
  }


  function bfs(graph, start, goal) {
    const queue = [{ node: start, path: [start], cost: 0 }];
    const visited = new Set();

    while (queue.length > 0) {
      const { node, path, cost } = queue.shift();

      if (node === goal) {
        return { path, cost };
      }

      visited.add(node);

      for (const neighbor in graph[node]) {
        if (!visited.has(neighbor)) {
          queue.push({
            node: neighbor,
            path: [...path, neighbor],
            cost: cost + graph[node][neighbor]
          });
          visited.add(neighbor);
        }
      }
    }

    return { path: [], cost: Infinity };
  }


  function ucs(graph, start, goal) {
    const queue = [{ node: start, path: [start], cost: 0 }];
    const visited = new Set();

    while (queue.length > 0) {
      queue.sort((a, b) => a.cost - b.cost);
      const { node, path, cost } = queue.shift();

      if (node === goal) {
        return { path, cost };
      }

      visited.add(node);

      for (const neighbor in graph[node]) {
        if (!visited.has(neighbor)) {
          const newCost = cost + graph[node][neighbor];
          queue.push({
            node: neighbor,
            path: [...path, neighbor],
            cost: newCost
          });
        }
      }
    }

    return { path: [], cost: Infinity };
  }

  function aStar(graph, start, goal, heuristic) {
    const queue = [];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    gScore[start] = 0;
    fScore[start] = heuristic(start);

    queue.push({ node: start, path: [start], cost: 0, heuristicValue: fScore[start] });

    while (queue.length > 0) {
      queue.sort((a, b) => a.cost + a.heuristicValue - (b.cost + b.heuristicValue));
      const { node, path, cost, heuristicValue } = queue.shift();

      if (node === goal) {
        return { path, cost: gScore[node], heuristicValue };
      }

      for (const neighbor in graph[node]) {
        const tentativeGScore = cost + graph[node][neighbor];

        if (!gScore[neighbor] || tentativeGScore < gScore[neighbor]) {
          cameFrom[neighbor] = node;
          gScore[neighbor] = tentativeGScore;
          const priority = tentativeGScore + heuristic(neighbor) + 1;

          const neighborInfo = { node: neighbor, path: [...path, neighbor], cost: tentativeGScore, heuristicValue: heuristic(neighbor) };

          if (!queue.some(item => item.node === neighbor)) {
            queue.push(neighborInfo);
          } else {
            const index = queue.findIndex(item => item.node === neighbor);
            if (priority < queue[index].cost + queue[index].heuristicValue) {
              queue[index] = neighborInfo;
            }
          }
        }
      }
    }

    console.log("No path found.");
    return { path: [], cost: Infinity, heuristicValue: Infinity };
  }

  for (const node in graph) {
    const neighbors = Object.keys(graph[node]);
    console.log(`${node} (h=${getHeuristic(node)}) connected to: ${neighbors.join(', ')}`);
  }

  const dfsResult = dfs(graph, startNode, goalNode);

  const bfsResult = bfs(graph, startNode, goalNode);

  const aStarResult = aStar(graph, 'S', 'G', getHeuristic); 

  const ucsResult = ucs(graph, startNode, goalNode);