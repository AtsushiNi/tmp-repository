import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Panel,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import ELK from 'elkjs/lib/elk.bundled.js';
import '@xyflow/react/dist/style.css';
// import tablesData from './tables.json';
import tablesData from './newTables.json';
import CustomNode from './CustomNode';
import './App.css'

const nodeTypes = {
  table: CustomNode,
};

const generateNodesAndEdges = (tables) => {
  const nodes = [];
  const edges = [];
  let x = 100;
  let y = 100;

  // 各テーブルの主キーを収集
  const tablePks = tables.map(table => ({
    tableIndex: tables.indexOf(table),
    tableName: table.name,
    pks: table.properties.filter(prop => prop.pk).map(prop => prop.name)
  }));

  tables.forEach((table, index) => {
    // テーブルノードを追加
    nodes.push({
      id: `table-${index}`,
      type: 'table',
      data: { 
        label: table.name,
        properties: table.properties
      },
      position: { x, y },
    });

    x += 300;
    if (x > 1000) {
      x = 100;
      y += 300;
    }
  });

  // テーブル間の関連を検出してEdgeを追加
  tablePks.forEach(sourceTable => {
    tablePks.forEach(targetTable => {
      if (sourceTable.tableIndex !== targetTable.tableIndex) {
        // 対象テーブルのPKプロパティ名を取得
        const targetProperties = tables[targetTable.tableIndex].properties
          .map(p => p.name);
        // ソーステーブルのPKが全て対象テーブルのPKに含まれるか確認 (nameベース比較)
        const allPksFound = sourceTable.pks.every(pk => targetProperties.includes(pk));
        // console.log("~~~~~~~~~~~~~~~")
        // console.log(sourceTable.tableName)
        // console.log(sourceTable.pks)
        // console.log(targetTable.tableName)
        // console.log(targetProperties)
        // console.log(allPksFound)
        
        if (allPksFound) {
          edges.push({
            id: `table-edge-${sourceTable.tableIndex}-${targetTable.tableIndex}`,
            source: `table-${sourceTable.tableIndex}`,
            target: `table-${targetTable.tableIndex}`,
          });
        }
      }
    });
  });

  return { nodes, edges };
};

const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(tablesData.tables);
const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '140',
  'elk.spacing.nodeNode': '220',
  'elk.direction': 'DOWN'
};

const getLayoutedElements = (nodes, edges) => {
  const graph = {
    id: 'root',
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: 'top',
      sourcePosition: 'bottom',
      width: 220,
      height: 84 + (node.data?.visiblePropertiesCount || node.data?.properties?.filter(p => p.pk).length || 1) * 36,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })),
      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

const ERDiagram = () => {
  const { fitView, getViewport, setViewport } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 前回のvisiblePropertiesCountを保持
  const prevCounts = React.useRef(nodes.map(node => 
    node.data?.visiblePropertiesCount || node.data?.properties?.filter(p => p.pk).length || 1
  ));

  // visiblePropertiesCountの変更を監視してレイアウト再計算
  useEffect(() => {
    let shouldRelayout = false;
    const newCounts = nodes.map(node => 
      node.data?.visiblePropertiesCount || node.data?.properties?.filter(p => p.pk).length || 1
    );

    // 前回と比較して変化があればレイアウト再計算
    if (newCounts.some((count, i) => count !== prevCounts.current[i])) {
      shouldRelayout = true;
      prevCounts.current = newCounts;
    }
    
    if (shouldRelayout) {
      onLayout();
    }
  }, [nodes]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  
  const onLayout = useCallback(
    (useInitialNodes = false) => {
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          const currentViewport = getViewport();
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          window.requestAnimationFrame(() => {
            setViewport(currentViewport);
          });
        },
      );
    },
    [nodes, edges],
  );

  useLayoutEffect(() => {
    onLayout(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Panel position="top-right">
          <button
            onClick={() => onLayout()}
            style={{ padding: '5px 10px' }}
          >
            レイアウト再計算
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

function App() {
  return (
    <ReactFlowProvider>
      <ERDiagram />
    </ReactFlowProvider>
  );
}

export default App;
