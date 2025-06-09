export const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: {
      label: 'Node 1',
      properties: {
        type: 'Input',
        description: 'Data source',
        status: 'Active'
      }
    }
  },
  {
    id: '2',
    position: { x: 250, y: 100 },
    data: {
      label: 'Node 2',
      properties: {
        type: 'Process',
        algorithm: 'ML Model',
        version: '1.2.3'
      }
    }
  },
  {
    id: '3',
    position: { x: 250, y: -100 },
    data: {
      label: 'Node 3',
      properties: {
        type: 'Output',
        format: 'JSON',
        size: 'Large'
      }
    }
  }
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' }
];
