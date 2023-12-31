class Stack {
  constructor() {
      this.items = [];
  }

  push(item) {
      this.items.push(item);
  }

  pop() {
      return this.items.pop();
  }

  isEmpty() {
      return this.items.length === 0;
  }
}

class Queue {
  constructor() {
      this.items = [];
  }

  enqueue(item) {
      this.items.push(item);
  }

  dequeue() {
      return this.items.shift();
  }

  isEmpty() {
      return this.items.length === 0;
  }
}

class PriorityQueue {
  constructor(comparator) {
      this.items = [];
      this.comparator = comparator || ((a, b) => a.priority - b.priority);
  }

  enqueue(item, priority) {
      this.items.push({ item, priority });
      this.items.sort(this.comparator);
  }

  dequeue() {
      return this.items.shift().item;
  }

  isEmpty() {
      return this.items.length === 0;
  }
}

const graph = {
  S: { G: 9, A: 2, B: 1 },
  A: { C: 2, D: 3 },
  B: { D: 2, E: 4 },
  C: { G: 4 },
  D: { G: 4 },
  E: {},
  G: {}
};

function dfs(graph, start, goal) {
  const stack = new Stack();
  const visited = new Set();

  stack.push({ node: start, path: [start], cost: 0 });

  while (!stack.isEmpty()) {
      const { node, path, cost } = stack.pop();

      if (node === goal) {
          return { path, cost };
      }

      visited.add(node);

      for (const neighbor in graph[node]) {
          if (!visited.has(neighbor)) {
              stack.push({
                  node: neighbor,
                  path: [...path, neighbor],
                  cost: cost + graph[node][neighbor]
              });
          }
      }
  }

  return { path: [], cost: Infinity };
}

function bfs(graph, start, goal) {
  const queue = new Queue();
  const visited = new Set();

  queue.enqueue({ node: start, path: [start], cost: 0 });

  while (!queue.isEmpty()) {
      const { node, path, cost } = queue.dequeue();

      if (node === goal) {
          return { path, cost };
      }

      visited.add(node);

      for (const neighbor in graph[node]) {
          if (!visited.has(neighbor)) {
              queue.enqueue({
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
  const priorityQueue = new PriorityQueue((a, b) => a.cost - b.cost);
  const visited = new Set();

  priorityQueue.enqueue({ node: start, path: [start], cost: 0 });

  while (!priorityQueue.isEmpty()) {
      const { node, path, cost } = priorityQueue.dequeue();

      if (node === goal) {
          return { path, cost };
      }

      visited.add(node);

      for (const neighbor in graph[node]) {
          if (!visited.has(neighbor)) {
              const newCost = cost + graph[node][neighbor];
              priorityQueue.enqueue({
                  node: neighbor,
                  path: [...path, neighbor],
                  cost: newCost
              }, newCost);
          }
      }
  }

  return { path: [], cost: Infinity };
}

function aStar(graph, start, goal, heuristic) {
  const priorityQueue = new PriorityQueue((a, b) => (a.cost + a.heuristicValue) - (b.cost + b.heuristicValue));
  const visited = new Set();
  const cameFrom = {};
  const gScore = {};

  gScore[start] = 0;
  const startNodeInfo = {
      node: start,
      path: [start],
      cost: 0,
      heuristicValue: heuristic(start)
  };
  priorityQueue.enqueue(startNodeInfo, startNodeInfo.cost + startNodeInfo.heuristicValue);

  while (!priorityQueue.isEmpty()) {
      const { node, path, cost, heuristicValue } = priorityQueue.dequeue();

      if (node === goal) {
          return { path, cost: gScore[node], heuristicValue };
      }

      visited.add(node);

      for (const neighbor in graph[node]) {
          const tentativeGScore = cost + graph[node][neighbor];

          if (!gScore[neighbor] || tentativeGScore < gScore[neighbor]) {
              cameFrom[neighbor] = node;
              gScore[neighbor] = tentativeGScore;
              const priority = tentativeGScore + heuristic(neighbor);

              const neighborInfo = {
                  node: neighbor,
                  path: [...path, neighbor],
                  cost: tentativeGScore,
                  heuristicValue: heuristic(neighbor)
              };

              if (!priorityQueue.items.some(item => item.node === neighbor)) {
                  priorityQueue.enqueue(neighborInfo, priority);
              } else {
                  const index = priorityQueue.items.findIndex(item => item.node === neighbor);
                  if (priority < priorityQueue.items[index].cost + priorityQueue.items[index].heuristicValue) {
                      priorityQueue.items[index] = neighborInfo;
                  }
              }
          }
      }
  }

  console.log("No path found.");
  return { path: [], cost: Infinity, heuristicValue: Infinity };
}

const dfsResult = dfs(graph, 'S', 'G');
const bfsResult = bfs(graph, 'S', 'G');
const ucsResult = ucs(graph, 'S', 'G');
const aStarResult = aStar(graph, 'S', 'G', (node) => 0);

console.log("DFS Result:", dfsResult);
console.log("BFS Result:", bfsResult);
console.log("UCS Result:", ucsResult);
console.log("A* Result:", aStarResult);
