import { ports } from '@/lib/ports';
import { useState, useEffect } from 'react';


const usePortsFilter = () => {
  // const [filteredPorts, setFilteredPorts] = useState<Port[]>([]);

  // useEffect(() => {
  //   const filtered = ports.filter(port => port.name.includes(filterBy));
  //   setFilteredPorts(filtered);
  // }, [ports, filterBy]);

  const getPort = async (value: string) => {
    const current = ports.find((p) => p.value === value);
    return current ? { label: current.name, value: current.value } : undefined;
  };

  const filterPorts = async (keyword: string) => {
    if (keyword === "") return [];
    return ports
      .filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase()))
      .map((p) => ({ label: p.name, value: p.value }));
  };

  return { getPort, filterPorts };
};

export default usePortsFilter;
