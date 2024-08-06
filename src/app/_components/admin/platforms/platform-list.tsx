"use client";

import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Platforms } from "@/drizzle/schema";

type Platform = typeof Platforms.$inferSelect;

const PlatformList = ({ platforms }: { platforms: Platform[] }) => {
  const router = useRouter();
  const onClickRow = (id: bigint) => {
    router.push(`/admin/platforms/${id}`);
  };

  return (
    <Table className="font-[0.8125rem] leading-[1.125rem] text-main">
      <TableHeader>
        <TableRow className="bg-background font-[0.8125rem] leading-[1.125rem] text-main">
          <TableHead className="px-[1.875rem]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Business ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {platforms.map((platform, index) => (
          <TableRow
            key={index}
            className="h-[3.75rem] cursor-pointer"
            onClick={() => onClickRow(platform.id)}
          >
            <TableCell className="px-[1.875rem]">
              {String(platform.id)}
            </TableCell>
            <TableCell>{platform.name}</TableCell>
            <TableCell>{platform.platformId}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PlatformList;
