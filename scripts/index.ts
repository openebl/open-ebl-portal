#! /usr/bin/env npx tsx

import { Command } from "commander";
import dotenv from "dotenv";
import eblCommand from "./commands/ebl";
import sendEmailCommand from "./commands/send-test-email";

dotenv.config();

const program = new Command();

program
  .name("ebl-portal-cli")
  .description("CLI to execute eBL Portal commands.")
  .version("0.1.0");

sendEmailCommand(program);
eblCommand(program);

program.parse();
