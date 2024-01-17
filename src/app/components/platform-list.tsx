"use client";

import { api } from "@/trpc/react";

const PlatformList = () => {
  const { data: platforms, isLoading, isError } = api.platform.all.useQuery()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>

  return (
    <ul>
      {platforms.map((platform, index) => (
        <li key={index}>{platform.name}, {platform.createdAt.toString()}</li>
      ))}
    </ul>
  );
};

export default PlatformList;
