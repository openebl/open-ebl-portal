#! /usr/bin/env npx tsx

import { Command } from "commander";
import eblCommand from "./commands/ebl";
import sendEmailCommand from "./commands/send-test-email";
import uploadCommand from "./commands/upload";

const program = new Command();

program.name("ebl-portal-cli").description("CLI to execute eBL Portal commands.").version("0.1.0");

sendEmailCommand(program);
eblCommand(program);
uploadCommand(program);

program.parse();
