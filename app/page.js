"use client";
import { useEffect, useState } from "react";
import IpExplorer from "./components/IpExplorer/IpExplorer";
import SubnetExplorer from "./components/SubnetExplorer/SubnetExplorer";

// TabButton component defined outside of render
const TabButton = ({ id, label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
      isActive
        ? "bg-white text-blue-600 shadow-md"
        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </button>
);

export default function Home() {
  const [ip, setIp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ip"); // "ip" or "subnet"

  // Fetch IP once
  useEffect(() => {
    fetch("/api/ip")
      .then(res => res.json())
      .then(data => {
        setIp(data.ip);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch IP address");
        setLoading(false);
      });
  }, []);

  // Show individual component based on active tab
  if (activeTab === "ip") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              IP Address Learning Center
            </h1>
            <div className="flex justify-center gap-4 bg-gray-100 p-2 rounded-xl">
              <TabButton
                id="ip"
                label="IP Explorer"
                icon="🔍"
                isActive={true}
                onClick={() => setActiveTab("ip")}
              />
              <TabButton
                id="subnet"
                label="Subnet Explorer"
                icon="🌐"
                isActive={false}
                onClick={() => setActiveTab("subnet")}
              />
            </div>
          </div>
          
          {/* IpExplorer Component */}
          <IpExplorer ip={ip} loading={loading} error={error} />
        </div>
      </div>
    );
  }

  if (activeTab === "subnet") {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              IP Address Learning Center
            </h1>
            <div className="flex justify-center gap-4 bg-gray-100 p-2 rounded-xl">
              <TabButton
                id="ip"
                label="IP Explorer"
                icon="🔍"
                isActive={false}
                onClick={() => setActiveTab("ip")}
              />
              <TabButton
                id="subnet"
                label="Subnet Explorer"
                icon="🌐"
                isActive={true}
                onClick={() => setActiveTab("subnet")}
              />
            </div>
          </div>
          
          {/* SubnetExplorer Component */}
          <SubnetExplorer ip={ip} loading={loading} error={error} />
        </div>
      </div>
    );
  }

  // Default fallback (shouldn't reach here)
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
          IP Address Learning Center
        </h1>
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to IP Under the Hood
          </h2>
          <p className="text-gray-600 mb-6">
            Learn about IP addresses, subnetting, and network fundamentals through interactive tools.
          </p>
          <div className="justify-center gap-4 bg-gray-100 p-2 rounded-xl inline-flex">
            <TabButton
              id="ip"
              label="IP Explorer"
              icon="🔍"
              isActive={activeTab === "ip"}
              onClick={() => setActiveTab("ip")}
            />
            <TabButton
              id="subnet"
              label="Subnet Explorer"
              icon="🌐"
              isActive={activeTab === "subnet"}
              onClick={() => setActiveTab("subnet")}
            />
          </div>
        </div>
        
        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-xl font-bold mb-2">IP Address Explorer</h3>
            <p className="text-gray-600">
              Visualize your IP address in decimal and binary formats. 
              Understand how octets work and see the binary representation.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-xl font-bold mb-2">Subnet Explorer</h3>
            <p className="text-gray-600">
              Interactive subnet calculator. Learn about CIDR notation, 
              network addresses, and host calculations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
