"use client";

import { useState, useEffect } from "react";
import {
  prefixToSubnetMask,
  calculateNetworkAddress,
  calculateBroadcastAddress,
  getFirstHost,
  getLastHost,
} from "../../utils/subnetCalculation";

export default function SubnetExplorer({ ip, loading, error }) {
  const [currentIp, setCurrentIp] = useState("192.168.1.1");
  const [currentPrefix, setCurrentPrefix] = useState(24);

  // Initialize IP from props
  useEffect(() => {
    if (ip && !error) {
      setCurrentIp(ip);
    }
  }, [ip, error]);

  /* ---------------- IP OCTET HANDLING ---------------- */

  const octets = currentIp.split(".").map(o => {
    const num = parseInt(o, 10);
    return isNaN(num) ? "0" : Math.max(0, Math.min(255, num)).toString();
  });

  const updateOctet = (index, value) => {
    // Handle empty string during typing
    if (value === "") {
      const updated = [...octets];
      updated[index] = "";
      setCurrentIp(updated.join("."));
      return;
    }
    
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    
    const validNum = Math.max(0, Math.min(255, num));
    const updated = [...octets];
    updated[index] = validNum.toString();
    setCurrentIp(updated.join("."));
  };

  // Validate current IP for calculations
  const isValidCurrentIP = octets.every(octet => {
    const num = parseInt(octet, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && octet !== "";
  });

  /* ---------------- CIDR HANDLING ---------------- */

  const decrementPrefix = () =>
    setCurrentPrefix(p => Math.max(8, p - 1));

  const incrementPrefix = () =>
    setCurrentPrefix(p => Math.min(30, p + 1));

  /* ---------------- CALCULATIONS ---------------- */

  // Only calculate if IP is valid
  const subnetMask = isValidCurrentIP ? prefixToSubnetMask(currentPrefix) : "Invalid IP";
  const networkAddress = isValidCurrentIP ? calculateNetworkAddress(currentIp, currentPrefix) : "Invalid IP";
  const broadcastAddress = isValidCurrentIP ? calculateBroadcastAddress(currentIp, currentPrefix) : "Invalid IP";

  const totalHosts = Math.pow(2, 32 - currentPrefix);
  const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

  // Calculate first and last hosts only if network and broadcast are valid
  const firstHost = isValidCurrentIP && networkAddress !== "Invalid IP" ? getFirstHost(networkAddress) : "Invalid IP";
  const lastHost = isValidCurrentIP && broadcastAddress !== "Invalid IP" ? getLastHost(broadcastAddress) : "Invalid IP";

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="rounded-xl p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        Subnet Explorer
      </h2>

      {/* IP + CIDR BOX */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">IP Address & CIDR Configuration</h3>
          {!isValidCurrentIP && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full self-start sm:self-auto">Invalid IP</span>
          )}
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center gap-4 sm:gap-6">
          {/* Octets */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="text-sm font-medium text-gray-700 min-w-max">IP Address:</label>
            <div className="flex items-center gap-1 sm:gap-2">
              {octets.map((octet, i) => (
                <div key={i} className="flex items-center">
                  <input
                    type="text"
                    value={octet}
                    onChange={e => updateOctet(i, e.target.value)}
                    onBlur={e => {
                      // On blur, ensure valid number or set to 0
                      if (e.target.value === "" || isNaN(parseInt(e.target.value, 10))) {
                        updateOctet(i, "0");
                      }
                    }}
                    className={`w-12 sm:w-16 text-center border rounded-md py-2 px-1 font-mono text-xs sm:text-sm transition-all ${
                      octet === "" || isNaN(parseInt(octet, 10)) || parseInt(octet, 10) > 255
                        ? "border-red-300 bg-red-50 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="0"
                    maxLength="3"
                  />
                  {i < 3 && <span className="text-gray-500 mx-0.5 sm:mx-1 font-mono text-sm">.</span>}
                </div>
              ))}
            </div>
          </div>

          {/* CIDR Stepper */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label className="text-sm font-medium text-gray-700 min-w-max">CIDR Prefix:</label>
            <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={decrementPrefix}
                disabled={currentPrefix <= 8}
                className="px-2 sm:px-3 py-1 sm:py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                -
              </button>

              <div className="px-3 sm:px-4 py-1 sm:py-2 font-mono text-base sm:text-lg min-w-12.5 sm:min-w-15 text-center">
                /{currentPrefix}
              </div>

              <button
                onClick={incrementPrefix}
                disabled={currentPrefix >= 30}
                className="px-2 sm:px-3 py-1 sm:py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Range indicator */}
        <div className="flex flex-wrap justify-between text-xs text-gray-500 mt-3 sm:mt-4 gap-2">
          <span className="whitespace-nowrap">/8 (16M hosts)</span>
          <span className="whitespace-nowrap">/16 (65K hosts)</span>
          <span className="whitespace-nowrap">/24 (254 hosts)</span>
          <span className="whitespace-nowrap">/30 (2 hosts)</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Quick CIDR Presets</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {[8, 16, 20, 22, 24, 26, 28, 30].map(preset => (
            <button
              key={preset}
              onClick={() => setCurrentPrefix(preset)}
              className={`p-2 sm:p-3 rounded-md text-xs sm:text-sm font-mono transition-all ${
                currentPrefix === preset
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              /{preset}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 transition-opacity duration-300 ${
        isValidCurrentIP ? "opacity-100" : "opacity-50"
      }`}>
        {/* Network Info */}
        <div className="bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 sm:p-5">
          <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-gray-800 flex items-center">
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-2"></span>
            Network Information
          </h3>

          <div className="space-y-2 sm:space-y-3">
            <Row 
              label="Subnet Mask" 
              value={subnetMask} 
              valueClass={subnetMask === "Invalid IP" ? "text-red-600" : "text-blue-600"}
            />
            <Row 
              label="Network Address" 
              value={networkAddress} 
              valueClass={networkAddress === "Invalid IP" ? "text-red-600" : "text-purple-600"}
            />
            <Row
              label="Broadcast Address"
              value={broadcastAddress}
              valueClass={broadcastAddress === "Invalid IP" ? "text-red-600" : "text-red-600"}
            />
          </div>
        </div>

        {/* Host Info */}
        <div className="bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 sm:p-5">
          <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-gray-800 flex items-center">
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2"></span>
            Host Information
          </h3>

          <div className="space-y-2 sm:space-y-3">
            <Row label="Total Addresses" value={totalHosts.toLocaleString()} valueClass="text-gray-600" />
            <Row
              label="Usable Hosts"
              value={usableHosts.toLocaleString()}
              valueClass="text-green-600 font-semibold"
            />
            <Row 
              label="First Host" 
              value={firstHost} 
              valueClass={firstHost === "Invalid IP" ? "text-red-600" : "text-blue-600"}
            />
            <Row 
              label="Last Host" 
              value={lastHost} 
              valueClass={lastHost === "Invalid IP" ? "text-red-600" : "text-blue-600"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL REUSABLE ROW ---------------- */

function Row({ label, value, valueClass = "text-gray-700" }) {
  const isError = value === "Invalid IP";
  
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 border transition-all gap-1 sm:gap-2 ${
      isError ? "border-red-200 bg-red-50" : "border-gray-200 hover:border-gray-300"
    }`}>
      <span className="text-gray-600 font-medium text-sm sm:text-base">{label}</span>
      <span className={`font-mono text-xs sm:text-sm break-all ${valueClass} ${isError ? "font-semibold" : ""}`}>
        {value}
      </span>
    </div>
  );
}
