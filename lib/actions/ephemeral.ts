import { type Event as NostrEvent } from "nostr-tools";
import NDK, {
  NDKEvent,
  NDKPrivateKeySigner,
  type NDKTag,
  type NDKFilter,
  type NDKSigner,
  type NDKUserProfile,
} from "@nostr-dev-kit/ndk";
import { getHashedKeyName } from "@/lib/nostr";

interface IFindEphemeralSignerLookups {
  name?: string;
  associatedEventNip19?: string;
}

/**
 * Finds a named ephemeral signer from a self-DM.
 */
export async function findEphemeralSigner(
  ndk: NDK,
  mainSigner: NDKSigner,
  opts: IFindEphemeralSignerLookups,
): Promise<NDKPrivateKeySigner | undefined> {
  const mainUser = await mainSigner.user();
  const filter: NDKFilter = { kinds: [2600 as number] };

  if (opts.name) {
    const hashedName = await getHashedKeyName(opts.name);
    filter["#e"] = [hashedName];
  } else if (opts.associatedEventNip19) {
    const hashedEventReference = await getHashedKeyName(
      opts.associatedEventNip19,
    );
    filter["#e"] = [hashedEventReference];
  }

  const event = await ndk.fetchEvent(filter);

  if (event) {
    const decryptEventFunction = async (event: NDKEvent) => {
      await event.decrypt(await mainSigner.user());
      const content = JSON.parse(event.content);
      return new NDKPrivateKeySigner(content.key);
    };

    const promise = new Promise<NDKPrivateKeySigner>((resolve, reject) => {
      let decryptionAttempts = 0;
      try {
        decryptionAttempts++;
        resolve(decryptEventFunction(event));
      } catch (e) {
        if (decryptionAttempts > 5) {
          console.error(
            `Failed to decrypt ephemeral signer event after ${decryptionAttempts} attempts.`,
          );
          reject(e);
          return;
        }
        setTimeout(() => {
          decryptEventFunction(event);
        }, 1000 * Math.random());
      }
    });

    return promise;
  }
}

interface ISaveOpts {
  associatedEvent?: NDKEvent;
  name?: string;
  metadata?: object;
  keyProfile?: NDKUserProfile;
  mainSigner?: NDKSigner;
}
type EphemeralKeyEventContent = {
  key: string;
  event?: string;
  version: string;
  metadata?: object;
};
function generateContent(
  targetSigner: NDKPrivateKeySigner,
  opts: ISaveOpts = {},
) {
  const content: EphemeralKeyEventContent = {
    key: targetSigner.privateKey!,
    version: "v1",
    ...opts.metadata,
  };

  if (opts.associatedEvent) content.event = opts.associatedEvent.encode();

  return JSON.stringify(content);
}
async function generateTags(mainSigner: NDKSigner, opts: ISaveOpts = {}) {
  const mainUser = await mainSigner.user();
  const tags = [
    ["p", mainUser.hexpubkey],
    ["client", "ordstr"],
  ];

  if (opts.associatedEvent) {
    // TODO: This is trivially reversable; better to encrypt it or hash it with the hexpubkey
    const hashedEventReference = await getHashedKeyName(
      opts.associatedEvent.encode(),
    );
    tags.push(["e", hashedEventReference]);
  }

  if (opts.name) {
    const hashedName = await getHashedKeyName(opts.name);
    tags.push(["e", hashedName]);
  }

  return tags;
}

export async function saveEphemeralSigner(
  ndk: NDK,
  targetSigner: NDKPrivateKeySigner,
  opts: ISaveOpts = {},
) {
  // Determine current user signer
  const mainSigner = opts.mainSigner || ndk.signer;

  if (!mainSigner) throw new Error("No main signer provided");

  const mainUser = await mainSigner.user();

  // Create 2600 kind which saves encrypted JSON of the ephemeral signer's private key, the associated list, and other metadata
  const event = new NDKEvent(ndk, {
    kind: 2600,
    content: generateContent(targetSigner, opts),
    tags: await generateTags(mainSigner, opts),
  } as NostrEvent);
  event.pubkey = mainUser.hexpubkey;
  await event.encrypt(mainUser, mainSigner);
  await event.publish();

  // Update Ephemeral signers metadata
  console.log("Checking keyProfile", opts.keyProfile);
  if (opts.keyProfile) {
    const user = await targetSigner.user();
    const event = new NDKEvent(ndk, {
      kind: 0,
      content: JSON.stringify(opts.keyProfile),
      tags: [] as NDKTag[],
    } as NostrEvent);
    event.pubkey = user.hexpubkey;
    await event.sign(targetSigner);
    await event.publish();
  }
}
