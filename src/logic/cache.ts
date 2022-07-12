import localforage from "localforage";

export const CACHE_KEY_NAME = "fs-archive";

const EMPTY_ARCHIVE: hole.Archive = { holes: [], replies: {}, images: {} };

export async function getFsArchive() {
  return await localforage.getItem(CACHE_KEY_NAME).then((val) => {
    if (val === null) {
      localforage.setItem(CACHE_KEY_NAME, EMPTY_ARCHIVE);
      return EMPTY_ARCHIVE;
    }
    else {
      return val as hole.Archive;
    }
  });
}

export async function setFsArchive(archive: hole.Archive) {
  await localforage.setItem(CACHE_KEY_NAME, archive);
}
