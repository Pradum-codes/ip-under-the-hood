function Octets(ip) {
  if (!ip || !ip.includes(".")) return null;

  const parts = ip.split(".");
  if (parts.length !== 4) return null;

  return {
    first: parts[0],
    second: parts[1],
    third: parts[2],
    fourth: parts[3],
  };
}

export default Octets;
