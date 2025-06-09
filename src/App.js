import React, { useEffect, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
// import tablesData from './tables.json';
import tablesData from './newTables.json';

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
      // type: 'input',
      data: { label: table.name },
      position: { x, y },
      style: { backgroundColor: '#f0abfc', width: 180, height: 60 },
    });

    // プロパティノードを追加
    table.properties.forEach((prop, propIndex) => {
      // nodes.push({
      //   id: `prop-${index}-${propIndex}`,
      //   data: { label: `${prop.name} (${prop.type})` },
      //   position: { x, y: y + 80 + propIndex * 50 },
      //   style: { 
      //     backgroundColor: prop.pk ? '#fca5a5' : '#a5b4fc',
      //     width: 180,
      //     height: 40 
      //   },
      // });

      // // テーブルとプロパティを接続
      // edges.push({
      //   id: `edge-${index}-${propIndex}`,
      //   source: `table-${index}`,
      //   target: `prop-${index}-${propIndex}`,
      // });
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

const ERDiagram = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      />
    </div>
  );
};

function App() {
  return <ERDiagram />;
}

export default App;
