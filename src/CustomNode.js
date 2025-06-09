import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ data, isConnectable }) => {
  const [showAllProperties, setShowAllProperties] = useState(false);
  const visiblePropertiesCount = data.properties?.filter(prop => showAllProperties || prop.pk).length || 0;
  data.visiblePropertiesCount = visiblePropertiesCount;
  return (
    <div 
      className="custom-node"
      style={{ 
        width: '220px',
        cursor: 'pointer'
      }}
      onClick={() => setShowAllProperties(!showAllProperties)}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
      <div className="custom-node__header">
        {data.label}
      </div>
      
      <div className="custom-node__properties">
        {data.properties
          ?.filter(prop => showAllProperties || prop.pk)
          .map((prop, index) => (
          <div 
            key={`${prop.name}-${index}`}
            className={`custom-node__property ${prop.pk ? 'custom-node__property--pk' : ''}`}>
            <span>{prop.name}</span>
            <span style={{ color: '#666' }}>{prop.type}</span>
          </div>
        ))}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});
