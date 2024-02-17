import { ReadStream } from "fs";
import { NextRequest } from "next/server";
import streamBuffers from 'stream-buffers';

export function bufferToStream(content: Buffer) {
  // const encoder = new TextEncoder();
  // const uint8array = encoder.encode(str);
  let position = 0;

  return new ReadableStream({
    pull(controller) {
      const chunkSize = 1024;
      const chunk = content.slice(position, position + chunkSize);
      controller.enqueue(chunk);
      position += chunkSize;

      if (position >= content.length) {
        controller.close();
      }
    },
  });
}

export function createNextRequest(body: Buffer, headers: Record<string, string> = {}) {
  // const stream = new streamBuffers.ReadableStreamBuffer({
  //   frequency: 10,      // in milliseconds.
  //   chunkSize: 2048     // in bytes.
  // });
  // stream.put(body);
  // stream.

  return new NextRequest(
    new Request('https://example.com/api/file/org', {
      method: 'POST',
      body,
      headers,
      // eslint-disable-next-line
      // @ts-ignore. duplex is not part of ts spec for now
      duplex: 'half',
    })
  );
}
