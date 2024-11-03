import React from "react";
import { styles } from "../../styles/RouletteWheelStyles";

interface RouletteWheelProps {
  segments: string[]; // Array of colors like ['red', 'black', ...]
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ segments }) => {
  const radius = 150; // Radius of the roulette wheel
  const segmentAngle = 360 / segments.length; // Angle for each segment

  // Function to generate the SVG paths for each segment
  const generateSegmentPath = (index: number) => {
    const startAngle = index * segmentAngle;
    const endAngle = startAngle + segmentAngle;

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    const x1 = radius + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = radius + radius * Math.sin((Math.PI * startAngle) / 180);
    const x2 = radius + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = radius + radius * Math.sin((Math.PI * endAngle) / 180);

    return `M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  return (
    <div style={styles.div}>
      <svg width={2 * radius} height={2 * radius}>
        {segments.map((color, index) => {
          return (
            <g key={index}>
              <path d={generateSegmentPath(index)} fill={color} strokeWidth="1" />
              {/* Add text label */}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default RouletteWheel;
