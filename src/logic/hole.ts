import dayjs, { unix as unixTimestamp } from "dayjs";
import utc from "dayjs/plugin/utc";
import { ENDPOINT_TIMEZONE_OFFSET } from "./endpoint";

dayjs.extend(utc);

function processRawHole(raw: hole.raw.RawHole): hole.Hole {
  const { pid, text, type, url, timestamp, reply, likenum, tag } = raw;
  let kind: hole.HoleKind;
  switch (type) {
    case "text":
      kind = { type };
      break;
    case "audio":
    case "image":
      kind = { type, url: url as string };
      break;
  }

  return {
    id: parseInt(pid),
    text,
    kind,
    timestamp: unixTimestamp(parseInt(timestamp)).utcOffset(ENDPOINT_TIMEZONE_OFFSET).toDate(),
    reply: parseInt(reply),
    likenum: parseInt(likenum),
    tag,
  };
}

const PEOPLE_PREFIX = /\[(洞主|\w+?(\s\w+)?)\]\s+/;

function processRawReply(raw: hole.raw.RawReply): hole.Reply {
  const { cid, pid, name, text, islz, timestamp, tag } = raw;
  return {
    id: parseInt(cid),
    hole: parseInt(pid),
    name,
    text: text.replace(PEOPLE_PREFIX, ""),
    dz: islz === 1,
    timestamp: unixTimestamp(parseInt(timestamp)).utcOffset(ENDPOINT_TIMEZONE_OFFSET).toDate(),
    tag,
  };
}

function dumpHole(hole: hole.Hole): MutateType<hole.Hole, Date, string> {
  const { timestamp } = hole;
  return { ...hole, timestamp: dayjs(timestamp).format() };
}

function dumpReply(reply: hole.Reply): MutateType<hole.Reply, Date, string> {
  const { timestamp } = reply;
  return { ...reply, timestamp: dayjs(timestamp).format() };
}

function parseHole(hole: MutateType<hole.Hole, Date, string>): hole.Hole {
  const { timestamp } = hole;
  return { ...hole, timestamp: dayjs(timestamp).toDate() };
}

function parseReply(reply: MutateType<hole.Reply, Date, string>): hole.Reply {
  const { timestamp } = reply;
  return { ...reply, timestamp: dayjs(timestamp).toDate() };
}

function dumpHoleEntry(entry: hole.HoleEntry): MutateType<hole.HoleEntry, Date, string> {
  const { entry: hole, snapshot } = entry;
  return { entry: dumpHole(hole), snapshot: dayjs(snapshot).format() };
}

function dumpReplyEntry(entry: hole.ReplyEntry): MutateType<hole.ReplyEntry, Date, string> {
  const { entry: reply, snapshot } = entry;
  return { entry: dumpReply(reply), snapshot: dayjs(snapshot).format() };
}

function parseHoleEntry(entry: MutateType<hole.HoleEntry, Date, string>): hole.HoleEntry {
  const { entry: hole, snapshot } = entry;
  return { entry: parseHole(hole), snapshot: dayjs(snapshot).toDate() };
}

function parseReplyEntry(entry: MutateType<hole.ReplyEntry, Date, string>): hole.ReplyEntry {
  const { entry: reply, snapshot } = entry;
  return { entry: parseReply(reply), snapshot: dayjs(snapshot).toDate() };
}

export function dumpHoleEntries(entries: hole.HoleEntry[]): hole.ArchiveHoleEntry[] {
  return entries.map(dumpHoleEntry);
}

export function dumpReplyEntries(entries: hole.ReplyEntry[]): hole.ArchiveReplyEntry[] {
  return entries.map(dumpReplyEntry);
}

export function parseHoleEntries(entries: hole.ArchiveHoleEntry[]): hole.HoleEntry[] {
  return entries.map(parseHoleEntry);
}

export function parseReplyEntries(entries: hole.ArchiveReplyEntry[]): hole.ReplyEntry[] {
  return entries.map(parseReplyEntry);
}

export function getHoleEntries(raw_page: hole.raw.RawHolePage): hole.HoleEntry[] {
  let { data } = raw_page;
  if (!Array.isArray(data))
    data = [data];
  const snapshot = raw_page.timestamp ? unixTimestamp(raw_page.timestamp).utcOffset(ENDPOINT_TIMEZONE_OFFSET) : dayjs();

  const holes = data.map(hole => ({ entry: processRawHole(hole), snapshot: snapshot.clone().toDate() }));
  return holes;
}

export function getReplyEntries(raw_page: hole.raw.RawReplyPage): hole.ReplyEntry[] {
  const { data } = raw_page;
  const snapshot = dayjs();

  const replies = data.map(reply => ({ entry: processRawReply(reply), snapshot: snapshot.clone().toDate() }));
  replies.sort((a, b) => a.entry.id - b.entry.id);
  return replies;
}

