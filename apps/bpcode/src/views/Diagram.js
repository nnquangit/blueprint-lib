import React, { useEffect } from "react";
import ReactFlow, { addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState } from "react-flow-renderer";
import { nodes as initialNodes, edges as initialEdges } from "./data";

const flowRun = (node, _app, _graph) => {
  if (node) {
    _graph.nodes.push(node);
  }

  if (node.enter) {
    node.enter(_app);
  }

  if (node.actions) {
    node.actions.forEach((_node) => {
      _graph.edges.push({ id: `e${node.id}-${_node.id}`, source: node.id, target: _node.id, animated: true });
      flowRun(_node, _app, _graph);
    });
  }
};

const app = {};
const graph = { nodes: [], edges: [] };
const flow = () => {
  return {
    id: "start",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 0 },
    enter: function (_app) {
      _app.store = "App";
    },
    actions: [
      {
        id: "listenning",
        data: { label: "Listenning" },
        position: { x: 100, y: 100 },
        enter: function (_app) {},
      },
    ],
  };
};

flowRun(flow(), app, graph);
// console.log(graph);
// console.log(initialNodes);
// console.log(initialEdges);


setTimeout(() => {
  console.log("setTimeout running");
  graph.edges[0].animated = false;
}, 5000);

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges);
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  useEffect(() => {
    // console.log("setTimeout ready");
  });

  return (
    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView attributionPosition="top-right">
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === "input") return "#0041d0";
          if (n.type === "output") return "#ff0072";
          if (n.type === "default") return "#1a192b";

          return "#eee";
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;

          return "#fff";
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

function Diagram() {
  return <OverviewFlow />;
}

export default Diagram;
