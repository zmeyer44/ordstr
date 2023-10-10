"use client";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactElement,
  useCallback,
  useEffect,
} from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import {
  NDKList,
  NDKListKinds,
  NDKKind,
  type NDKEvent,
  type NDKUser,
  NDKSubscriptionCacheUsage,
  type NDKFilter,
  NDKSubscription,
} from "@nostr-dev-kit/ndk";
import { useNDK } from "../ndkProvider";

export const blockedListNames = ["mute"];

type ListsContextProps = {
  lists: Map<string, NDKList>;
  deletions: Set<string>;
  sortedLists: NDKList[];
  sortedListWithKind: (kinds: number[]) => NDKList[];
  getLists: (pubkey: string) => NDKSubscription | void;
  loading: boolean;
};
const ListsContext = createContext<ListsContextProps | undefined>(undefined);

export default function ListsProvider({
  children,
}: {
  children: ReactElement;
}) {
  //   const { lists, addList } = useTest();
  const { ndk } = useNDK();
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<Map<string, NDKList>>(new Map());
  const [deletions, setDeletions] = useState<Set<string>>(new Set());
  const sortedLists = useMemo(() => {
    if (!lists) {
      return [];
    }
    // return alphabetically sorted lists
    return [...lists.values()].sort((a, b) => {
      return a.title!.localeCompare(b.title!);
    });
  }, [lists]);
  const sortedUserLists = useMemo(() => {
    if (!sortedLists) {
      return [];
    }
    return sortedLists.filter((list: NDKList) => {
      if (blockedListNames.includes(list.title!)) return;
      const correctKind = list.kind === NDKKind.CategorizedPeopleList;
      const pTags = list.tags.filter((tag) => tag[0] === "p").length;
      const mostlyPTags = pTags / list.tags.length > 0.5;

      return correctKind && mostlyPTags;
    });
  }, [sortedLists]);
  const sortedHighlightList = useMemo(() => {
    if (!sortedLists) {
      return [];
    }
    return sortedLists.filter((list: NDKList) => list.kind === 39802);
  }, [sortedLists]);

  const sortedListWithKind = useCallback(
    (kinds: number[]) => {
      if (!sortedLists) return [];
      return sortedLists.filter((list: NDKList) =>
        kinds.includes(list.kind as number),
      );
    },
    [sortedLists],
  );
  const [requestedDeletions, setRequestedDeletions] = useState(
    new Set<string>(),
  );
  function getListsFromFilter(filter: NDKFilter): NDKSubscription {
    const sub = ndk!.subscribe(filter, {
      closeOnEose: false,
      groupable: false,
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    });

    sub.on("event", processEvent);

    return sub;
  }
  /**
   * Called when a deletion event is received.
   *
   * - Removes the list from the store if the deletion event is newer than the list's creation event.
   * - Adds the list's tag to the deletions set.
   * - Deletes the list's event from the cache.
   */
  function processDeletionEvent(event: NDKEvent) {
    const tag = event.tagValue("a");
    if (tag) {
      setDeletions((deletions) => {
        deletions.add(tag);
        return deletions;
      });
      setLists((lists) => {
        // get the list from the store
        const list = lists.get(tag);
        if (!list) return lists;

        // remove the list from the store if the timestamp of the deletion is greater than the list's timestamp
        if (event.created_at! > list.created_at!) {
          lists.delete(tag);

          // delete from the cache the list's event
          // db.events.delete(list.tagId());
        }
        return lists;
      });
    }
  }
  function shouldRequestDeletion(event: NDKEvent) {
    return !requestedDeletions.has(event.tagId());
  }

  function getLists(pubkey: string) {
    if (!loading) {
      setLoading(true);
    }
    const sub = ndk?.subscribe(
      {
        kinds: [...(NDKListKinds as number[])],
        authors: [pubkey],
      },
      {
        closeOnEose: false,
        groupable: false,
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      },
    );
    if (!sub) {
      setLoading(false);
      return;
    }

    sub.on("event", processEvent);

    // sub.on("eose", () => setLoading(false));

    return sub;
  }
  /**
   * Called when a list event is received.
   *
   * - Adds the list to the store.
   * - Checks if the list has been deleted.
   */
  function processEvent(event: NDKEvent) {
    if (!shouldProcess(event)) return;
    console.log("Processing event passed", event);

    event.ndk = ndk!; // #ndk-bug? this should be already set when it's called from the subscription
    const list = NDKList.from(event);

    setLists((lists) => {
      return new Map(lists.set(list.tagId(), list));
    });

    if (shouldRequestDeletion(event)) {
      requestedDeletions.add(event.tagId());

      // Request deletions specific to each list
      const deletionSub = ndk!.subscribe(
        {
          kinds: [NDKKind.EventDeletion as number],
          ...event.filter(),
        },
        {
          closeOnEose: true,
          groupableDelay: 1000,
        },
      );

      deletionSub.on("event", processDeletionEvent);
    }
  }

  return (
    <ListsContext.Provider
      value={{
        lists,
        getLists,
        deletions,
        sortedLists,
        sortedListWithKind,
        loading,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  return useContext(ListsContext);
}

function shouldProcess(event: NDKEvent) {
  // filter out bad list names
  if (event.kind !== NDKKind.EventDeletion) {
    const title = NDKList.from(event).title!;
    if (!title || title.startsWith("chats/")) {
      return;
    }
  }

  return true;
}
