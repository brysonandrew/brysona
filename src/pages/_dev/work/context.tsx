import {
  ChangeEventHandler,
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { useLocalStorage } from '@brysonandrew/hooks-dom/local-storage';
import { NOOP } from '@brysonandrew/utils-function';
import {
  HOURLY_DEFAULT,
  ITEMS,
  PROPOSALS_DEFAULT,
  UPWORK_BASE,
} from '@pages/_dev/work/config/constants';
import {
  TInitIdItem,
  TInitIdItems,
  TUpworkFilterConfig,
} from '@pages/_dev/work/config/types';
import { resolveKey } from '@pages/_dev/work/key';
import { valueToNamePath } from '@pages/_dev/work/utils/value-to-name-path';
import { resolveUpworkParams } from '@pages/_dev/work/item/resolveUpworkParams';
import {
  INIT_VIEWPORT,
  TViewport,
  useViewportMeasure,
} from '@brysonandrew/viewport';
import { useKey } from '@brysonandrew/hooks';

export type TCommonState = Required<
  Pick<
    TUpworkFilterConfig,
    'isExpert' | 'isIntermediate' | 'hourly'
  >
> &
  Pick<TUpworkFilterConfig, 'location'>;

type TWorkInputElement = HTMLInputElement;
export type TWorkInput = TWorkInputElement | null;

type TPathHandlers = {
  params(q: string, commonState: TCommonState): string;
  href(params: string): string;
};

const INIT_KEY_RECORD = {
  shift: false,
  alt: false,
};

export type TWorkStateContext = {
  isQ: boolean;
  q: string;
  commonState: TCommonState;
  items: TInitIdItems;
  reset(): void;
  remove(id: string): void;
  add(item: TInitIdItem): void;
  onCommonStateChange: ChangeEventHandler<TWorkInputElement>;
  onQChange: ChangeEventHandler<TWorkInputElement>;
  onQDelete(): void;
  pathHandlers: TPathHandlers;
  onKeywordClick(value: string): void;
  input: TWorkInput;
  onInputRef(next: TWorkInput): void;
  viewport: TViewport;
  keyRecord: typeof INIT_KEY_RECORD;
};

const pathHandlers: TPathHandlers = {
  params: (_: string) => '',
  href: (_: string) => '',
};
const Q = 'Custom';
const INIT: TWorkStateContext = {
  isQ: Boolean(Q),
  q: Q,
  commonState: {
    hourly: HOURLY_DEFAULT,
    isExpert: true,
    isIntermediate: false,
    ...PROPOSALS_DEFAULT,
  },
  items: ITEMS,
  reset: NOOP,
  remove: NOOP,
  add: NOOP,
  onCommonStateChange: NOOP,
  onQChange: NOOP,
  onQDelete: NOOP,
  pathHandlers,
  onKeywordClick: NOOP,
  input: null,
  onInputRef: NOOP,
  viewport: INIT_VIEWPORT,
  keyRecord: INIT_KEY_RECORD,
} as TWorkStateContext;
export const STATE = createContext<TWorkStateContext>(INIT);

export const useWorkState = (): TWorkStateContext =>
  useContext<TWorkStateContext>(STATE);

export const WorkStateProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const viewport = useViewportMeasure({
    isContainer: true,
  });
  const [keyRecord, setKeyRecord] = useState(
    INIT.keyRecord,
  );
  const [input, setWorkInput] = useState<TWorkInput>(null);
  const [items, setItems] = useLocalStorage<TInitIdItems>(
    resolveKey('items'),
    INIT.items,
  );
  const [commonState, setState] =
    useLocalStorage<TCommonState>(
      resolveKey('filters'),
      INIT.commonState,
    );
  const reset = () => setItems(ITEMS);
  const remove = (id: string) =>
    setItems((prev) => prev.filter((v) => v.id !== id));
  const add = (item: TInitIdItem) =>
    setItems((prev) => [item, ...prev]);
  const [q, setQ] = useLocalStorage(
    resolveKey('q'),
    INIT.q ?? 'query',
  );

  useKey({
    handlers: {
      onKeyDown: (event) => {
        if (event.altKey) {
          setKeyRecord((prev) => ({
            ...prev,
            alt: true,
          }));
        }
        if (event.shiftKey) {
          setKeyRecord((prev) => ({
            ...prev,
            shift: true,
          }));
        }
      },
      onKeyUp: (event) => {
        if (event.key === 'Alt') {
          console.log(
            'KEY UP ',
            event.shiftKey,
            event.altKey,
            event,
            event.key,
          );
          setKeyRecord((prev) => ({
            ...prev,
            alt: false,
          }));
        }

        if (event.key === 'Shift') {
          setKeyRecord((prev) => ({
            ...prev,
            shift: false,
          }));
        }
      },
    },
  });

  const handleQChange: ChangeEventHandler<
    TWorkInputElement
  > = (event) => {
    setQ(event.target.value);
  };

  const handleQDelete = () => {
    setQ('');
  };

  const handleCommonStateChange: ChangeEventHandler<
    TWorkInputElement
  > = (event) => {
    const namePath = event.target.name;
    const value =
      event.target.type === 'checkbox' &&
      'checked' in event.target
        ? event.target.checked
        : event.target.value;
    setState((prev) => {
      valueToNamePath(namePath, value, prev);
      return prev;
    });
  };

  const resolveParams = (
    q: string,
    commonState: TCommonState,
  ) => {
    const params = resolveUpworkParams(commonState);
    const restParams = new URLSearchParams(
      params,
    ).toString();
    return q
      ? `q=${q}${restParams ? `&${restParams}` : ''}`
      : restParams;
  };

  const resolveHref = (params: string) => {
    return `${UPWORK_BASE}?${params}`;
  };
  const handleKeywordClick = (value: string) => {
    if (keyRecord.alt || keyRecord.shift) {
      setQ(value);
    } else {
      setQ((prev) => {
        if (!prev) return value;
        if (prev.includes(value)) {
          const rx = new RegExp(`${value}`, 'gi');
          const next = prev.replace(rx, '');
          return next;
        }
        return `${prev} ${value}`;
      });
    }

    if (input) input.select();
  };
  const handleInputRef = (instance: TWorkInput) => {
    if (instance && !input) {
      console.log(instance, input);
      setWorkInput(instance);
    }
  };
  return (
    <STATE.Provider
      value={{
        keyRecord,
        viewport,
        input,
        onInputRef: handleInputRef,
        q,
        isQ: Boolean(q),
        items,
        reset,
        remove,
        add,
        commonState,
        onCommonStateChange: handleCommonStateChange,
        onQChange: handleQChange,
        onQDelete: handleQDelete,
        onKeywordClick: handleKeywordClick,
        pathHandlers: {
          params: resolveParams,
          href: resolveHref,
        },
      }}
    >
      {children}
    </STATE.Provider>
  );
};
