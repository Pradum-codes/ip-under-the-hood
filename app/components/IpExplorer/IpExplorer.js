"use client";
import Octets from "../../utils/ip-alter/octets";
import ConvertIPToBinary from "../../utils/conversion/iptobinary";

export default function IpExplorer({ ip, loading, error }) {
  // Derive octets when IP changes
  const octets = ip && !error ? Octets(ip) : null;
  const octetsBinary = ip && !error ? ConvertIPToBinary(ip) : null;

  const octetBox = (octet, bgcolor, label) => (
    <div className={`p-4 rounded-lg text-center shadow-md ${bgcolor} transition-all hover:shadow-lg`}>
      <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">{label}</div>
      <span className="text-2xl font-mono font-bold">{octet}</span>
    </div>
  );

  const dotSeparator = () => (
    <div className="flex items-center justify-center">
      <span className="text-3xl font-bold text-gray-700">.</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-600">Loading your IP address...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            IP Address Explorer
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6 inline-block">
            <p className="text-sm text-gray-600 mb-2">Your Current IP Address</p>
            <p className="text-3xl md:text-4xl font-mono font-bold text-blue-600">{ip}</p>
          </div>
        </div>

        {/* Decimal Octets */}
        {octets && (
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
              Decimal Octets
            </h2>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4 items-center justify-center">
              {octetBox(octets.first, "bg-blue-200 hover:bg-blue-300", "1st Octet")}
              <div className="hidden md:block">{dotSeparator()}</div>
              {octetBox(octets.second, "bg-green-200 hover:bg-green-300", "2nd Octet")}
              <div className="hidden md:block">{dotSeparator()}</div>
              {octetBox(octets.third, "bg-yellow-200 hover:bg-yellow-300", "3rd Octet")}
              <div className="hidden md:block">{dotSeparator()}</div>
              {octetBox(octets.fourth, "bg-red-200 hover:bg-red-300", "4th Octet")}
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Each octet represents 8 bits and can range from 0 to 255
              </p>
            </div>
          </div>
        )}

        {/* Binary Octets */}
        {octetsBinary && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
              Binary Representation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {octetsBinary.map((binary, index) => {
                const colors = [
                  "bg-blue-200 hover:bg-blue-300",
                  "bg-green-200 hover:bg-green-300", 
                  "bg-yellow-200 hover:bg-yellow-300",
                  "bg-red-200 hover:bg-red-300"
                ];
                const labels = ["1st Octet", "2nd Octet", "3rd Octet", "4th Octet"];
                
                return (
                  <div key={index} className={`p-6 rounded-lg shadow-md ${colors[index]} transition-all hover:shadow-lg`}>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">{labels[index]}</div>
                      <div className="text-2xl font-mono font-bold mb-2">{binary}</div>
                      <div className="text-sm text-gray-600">
                        = {parseInt(binary, 2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Each binary octet shows the 8-bit representation of the decimal value
              </p>
            </div>
          </div>
        )}

        {/* Educational Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-12">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Understanding IP Addresses</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">IPv4 Structure</h4>
              <p>
                An IPv4 address consists of 32 bits divided into 4 octets of 8 bits each. 
                Each octet can represent values from 0 to 255 in decimal notation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Binary Conversion</h4>
              <p>
                The binary representation shows how computers actually store and process 
                IP addresses using only 1s and 0s.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}