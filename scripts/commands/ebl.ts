//
// scripts to list ebls from bu server. this is mainly for testing purposes
//

import createClient from "openapi-fetch";
import dotenv from "dotenv";

import { currentStatus, eblParties } from "@/lib/ebl";
import { type paths } from "@/types/bu-scheme";
import { Command } from "commander";

dotenv.config();
const { env } = await import("@/env.js");

export default function command(command: Command) {
  const eBlCommand = new Command("ebl");
  eBlCommand
    .command("list <buid>")
    .description("List EBl records from the BU server with given BUID.")
    .option("-s, --status", "Show status in the output")
    .option("-p, --parties", "Show parties in the output")
    .action(
      async (
        buid: string,
        { status, parties }: { status?: boolean; parties?: boolean },
      ) => {
        const ebls = [];
        for await (const item of fetchEBls(buid)) {
          ebls.push(item);
        }

        const output =
          status ?? parties
            ? ebls.map((ebl) => ({
                id: ebl.bl?.id,
                ...(status && { status: currentStatus(ebl) }),
                ...(parties && { parties: eblParties(ebl) }),
              }))
            : ebls;
        console.info(JSON.stringify(output, null, 2));
      },
    );

  eBlCommand
    .command("get <buid> <eblid>")
    .description(
      "Get specific EBl record from the BU server with given BUID and EBlID.",
    )
    .option("-s, --status", "Show status in the output")
    .option("-p, --parties", "Show parties in the output")
    .action(
      async (
        buid: string,
        eblid: string,
        { status, parties }: { status?: boolean; parties?: boolean },
      ) => {
        const ebl = await getEBl(buid, eblid);
        const output =
          status ?? parties
            ? {
                id: ebl.bl?.id,
                ...(status && { status: currentStatus(ebl) }),
                ...(parties && { parties: eblParties(ebl) }),
              }
            : ebl;

        console.info(JSON.stringify(output, null, 2));
      },
    );

  command.addCommand(eBlCommand);
}

async function getEBl(buid: string, id: string) {
  const client = createClient<paths>({ baseUrl: env.BU_SERVER_URL });
  const { data, error } = await client.GET("/ebl/{id}", {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.BU_SERVER_API_KEY}`,
      "X-Business-Unit-ID": buid,
    },
    params: {
      path: { id },
    },
  });
  if (error) {
    throw error;
  }
  return data;
}

async function* fetchEBls(buid: string) {
  let offset = 0;
  const limit = 50;
  const client = createClient<paths>({ baseUrl: env.BU_SERVER_URL });

  while (true) {
    const { data, error } = await client.GET("/ebl", {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.BU_SERVER_API_KEY}`,
        "X-Business-Unit-ID": buid,
      },
      params: {
        query: {
          offset,
          limit: limit,
          filters: "ACTION_NEEDED",
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data.records) {
      break; // blank response
    }

    for (const item of data.records) {
      yield item;
    }

    if (data.records?.length < limit) {
      break; // No more data to fetch
    }

    offset += limit;
  }
}
