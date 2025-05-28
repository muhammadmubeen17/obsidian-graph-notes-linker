import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Node, Edge } from './ObsidianInterface';

interface GraphViewProps {
  nodes: Node[];
  edges: Edge[];
  onNodeSelect: (node: Node) => void;
  selectedNode: Node | null;
}

export const GraphView: React.FC<GraphViewProps> = ({
  nodes,
  edges,
  onNodeSelect,
  selectedNode
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;

    // Create the simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(edges).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create container group
    const container = svg.append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Create links
    const links = container.append("g")
      .selectAll("line")
      .data(edges)
      .enter().append("line")
      .attr("stroke", "#D1D5DB")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Create nodes
    const nodeGroups = container.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .style("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add circles for nodes
    const circles = nodeGroups.append("circle")
      .attr("r", (d) => d.type === "identity" ? 20 : 15)
      .attr("fill", (d) => {
        if (d.type === "identity") return "#8B5CF6";
        if (d.type === "platform") return "#06B6D4";
        return "#10B981";
      })
      .attr("stroke", (d) => selectedNode?.id === d.id ? "#F59E0B" : "#9CA3AF")
      .attr("stroke-width", (d) => selectedNode?.id === d.id ? 3 : 2);

    // Add labels
    const labels = nodeGroups.append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.type === "identity" ? 35 : 30)
      .attr("font-size", "12px")
      .attr("fill", "#374151")
      .attr("font-weight", "500");

    // Add click handler
    nodeGroups.on("click", (event, d) => {
      event.stopPropagation();
      onNodeSelect(d);
    });

    // Add hover effects
    nodeGroups
      .on("mouseenter", function(event, d) {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) => (d.type === "identity" ? 25 : 20))
          .attr("stroke-width", 3);
        
        d3.select(this).select("text")
          .transition()
          .duration(200)
          .attr("font-size", "14px")
          .attr("fill", "#FFFFFF");
      })
      .on("mouseleave", function(event, d) {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) => (d.type === "identity" ? 20 : 15))
          .attr("stroke-width", selectedNode?.id === d.id ? 3 : 2);
        
        d3.select(this).select("text")
          .transition()
          .duration(200)
          .attr("font-size", "12px")
          .attr("fill", "#E5E7EB");
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      links
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroups
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, edges, dimensions, selectedNode, onNodeSelect]);

  return (
    <div className="flex-1 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Knowledge Graph</h2>
          <div className="text-sm text-gray-600">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              Identity
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
              Platform
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              Identifier
            </div>
          </div>
        </div>
      </div>
      
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="bg-gray-50"
      />
      
      <div className="absolute bottom-4 right-4 text-sm text-gray-600 bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
        Drag to move • Click to select • Scroll to zoom
      </div>
    </div>
  );
};
