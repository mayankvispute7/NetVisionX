"use client";

import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";


// Interface for type safety
interface Device {
  id: string;
  name: string;
  ip: string;
  type: string;
  status: string;
  traffic: string;
}

export default function TopologyMap() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopology = async () => {
      try {
        // 1. Retrieve the JWT token from secure local storage
        const token = localStorage.getItem("token");
        if (!token) return; // Wait for page.tsx to redirect if no token

        // 2. Fetch secure data with the Bearer token
        const response = await fetch("https://netvisionx.onrender.com/api/v1/devices", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const devices: Device[] = await response.json();

          // 3. Create the Main WAN Gateway Node
          const newNodes: Node[] = [
            {
              id: "gateway",
              position: { x: 400, y: 50 },
              data: { label: "Main WAN Gateway" },
              style: {
                background: "#0f172a", // Slate 900
                color: "#fff",
                border: "2px solid #0ea5e9", // Sky 500
                borderRadius: "12px",
                padding: "15px",
                fontWeight: "bold",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              },
            },
          ];

          const newEdges: Edge[] = [];

          // 4. Map the fetched devices to React Flow nodes below the gateway
          devices.forEach((device, index) => {
            // Calculate a nice staggered tree layout
            const xPos = 100 + (index * 220);
            const yPos = 250 + (index % 2 === 0 ? 0 : 40);

            const isOnline = device.status === "online";
            const color = isOnline ? "#10b981" : "#f43f5e"; // Emerald vs Rose

            newNodes.push({
              id: device.id,
              position: { x: xPos, y: yPos },
              data: { 
                label: (
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="font-bold text-sm">{device.name}</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-md text-slate-500">{device.ip}</span>
                  </div>
                ) 
              },
              style: {
                background: "#ffffff",
                color: "#0f172a",
                border: `2px solid ${color}`,
                borderRadius: "12px",
                padding: "10px",
                minWidth: "160px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              },
            });

            // 5. Connect the device to the gateway
            newEdges.push({
              id: `e-gateway-${device.id}`,
              source: "gateway",
              target: device.id,
              animated: isOnline, // Line animates only if device is online!
              style: { stroke: color, strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: color,
              },
            });
          });

          setNodes(newNodes);
          setEdges(newEdges);
        }
      } catch (error) {
        console.error("Error fetching topology:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchTopology();
    
    // Poll the backend every 5 seconds to keep the map "live"
    const interval = setInterval(fetchTopology, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
        Scanning network infrastructure...
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-50/50">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        fitView 
        attributionPosition="bottom-right"
      >
        <Background color="#94a3b8" gap={20} size={1.5} />
        <Controls />
      </ReactFlow>
    </div>
  );
}