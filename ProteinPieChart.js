import React from 'react';
import Svg, { Circle, Path, Text } from 'react-native-svg';

const ProteinPieChart = ({ percentage }) => {
  const size = 120;
  const center = size / 2;
  const radius = 50;
  
  // Ensure percentage is between 0 and 100
  const validPercentage = Math.min(100, Math.max(0, percentage));
  
  // Convert percentage to radians
  const angle = (validPercentage / 100) * 2 * Math.PI;
  
  // Calculate end point
  const endX = center + radius * Math.sin(angle);
  const endY = center - radius * Math.cos(angle);
  
  // Create path
  const path = validPercentage === 0
    ? ''
    : validPercentage === 100
      ? `M${center},${center - radius} A${radius},${radius} 0 1,1 ${center - 0.001},${center - radius} Z`
      : `M${center},${center} L${center},${center - radius} A${radius},${radius} 0 ${validPercentage > 50 ? 1 : 0},1 ${endX},${endY} Z`;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke="#E0E0E0"
        strokeWidth="10"
      />
      <Path
        d={path}
        fill="#F79E4F"
      />
      <Text
        x={center}
        y={center + 5}
        fontSize="16"
        fontWeight="bold"
        textAnchor="middle"
        fill="#333"
      >
        {`${Math.round(validPercentage)}%`}
      </Text>
    </Svg>
  );
};

export default ProteinPieChart;
