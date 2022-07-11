export { };
declare global {
    type MutateType<T, U, V> = T extends U ? V : {
      [K in keyof T]: MutateType<T[K], U, V>;
    };

    type Tail<T extends any[]> = T extends [head: any, ...tail: infer Residual]
      ? Residual
      : never;

    type Length<T extends any[]> = T["length"];

    type MutateTypes<T, U extends [any, any][]> = Length<U> extends 0
      ? T
      : MutateTypes<MutateType<T, U[0][0], U[0][1]>, Tail<U>>;

    namespace hole {
      namespace raw {
        interface RawHole {
          pid: string
          text: string
          type: "text" | "image" | "audio"
          url?: string
          timestamp: string
          reply: string
          likenum: string
          tag: string | null
        }

        interface RawHolePage {
          code: number
          data: RawHole[] | RawHole
          timestamp?: number
        }

        interface RawReply {
          cid: string
          pid: string
          name: string
          text: string
          islz: 0 | 1
          timestamp: string
          tag: string | null
        }

        interface RawReplyPage {
          code: number
          data: [RawReply]
        }
      }

      namespace kind {
        interface Text {
          type: "text"
        }

        interface Image {
          type: "image"
          url: string
        }

        interface Audio {
          type: "audio"
          url: string
        }

      }

        type HoleKind = kind.Text | kind.Image | kind.Audio;

        interface Hole {
          id: number
          text: string
          kind: HoleKind
          timestamp: Date
          reply: number
          likenum: number
          tag: string | null
        }

        interface HoleEntry {
          entry: Hole
          snapshot: Date
        }

        interface Reply {
          id: number
          hole: number
          name: string
          text: string
          dz: boolean
          timestamp: Date
          tag: string | null
        }

        interface ReplyEntry {
          entry: Reply
          snapshot: Date
        }

        type ArchiveHoleEntry = MutateType<hole.HoleEntry, Date, string>;
        type ArchiveReplyEntry = MutateType<hole.ReplyEntry, Date, string>;

        interface Archive {
          holes: ArchiveHoleEntry[]
          replies: Record<number, ArchiveReplyEntry[]>
          images: Record<number, string>
        }
    }
}
