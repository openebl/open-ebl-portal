/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import Long from "long";

export const protobufPackage = "bluex.proto";

export interface Time {
  /** UNIX time */
  time: number;
  /** Time zone offset. Eg: GMT+8, the value will be 8 * 60 * 60 = 28800 */
  timezoneOffset: number;
  timezoneName: string;
}

function createBaseTime(): Time {
  return { time: 0, timezoneOffset: 0, timezoneName: "" };
}

export const Time = {
  encode(message: Time, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.time !== 0) {
      writer.uint32(8).int64(message.time);
    }
    if (message.timezoneOffset !== 0) {
      writer.uint32(16).int64(message.timezoneOffset);
    }
    if (message.timezoneName !== "") {
      writer.uint32(26).string(message.timezoneName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Time {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTime();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.time = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.timezoneOffset = longToNumber(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.timezoneName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Time {
    return {
      time: isSet(object.time) ? globalThis.Number(object.time) : 0,
      timezoneOffset: isSet(object.timezoneOffset) ? globalThis.Number(object.timezoneOffset) : 0,
      timezoneName: isSet(object.timezoneName) ? globalThis.String(object.timezoneName) : "",
    };
  },

  toJSON(message: Time): unknown {
    const obj: any = {};
    if (message.time !== 0) {
      obj.time = Math.round(message.time);
    }
    if (message.timezoneOffset !== 0) {
      obj.timezoneOffset = Math.round(message.timezoneOffset);
    }
    if (message.timezoneName !== "") {
      obj.timezoneName = message.timezoneName;
    }
    return obj;
  },

  create(base?: DeepPartial<Time>): Time {
    return Time.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Time>): Time {
    const message = createBaseTime();
    message.time = object.time ?? 0;
    message.timezoneOffset = object.timezoneOffset ?? 0;
    message.timezoneName = object.timezoneName ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
