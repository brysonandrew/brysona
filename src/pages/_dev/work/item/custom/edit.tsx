import { FC, KeyboardEventHandler } from 'react';
import { useWorkState } from '@pages/_dev/work/context';
import { WorkItemEditButtons } from '@pages/_dev/work/item/custom/buttons';
import { WorkItemCustomAutocomplete } from '@pages/_dev/work/item/custom/autocomplete';

export const INUT_NAME_Q = 'q';
export const WorkItemEdit: FC = () => {
  const {
    viewport,
    q,
    pathHandlers,
    onQChange,
    commonState,
    onInputRef,
  } = useWorkState();
  const params = pathHandlers.params(q, commonState);
  const href = pathHandlers.href(params);

  const isValue = Boolean(q);
  const width = `calc(${q.toString().length}ch + 12rem)`;

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      window.open(href, '_newtab', 'noopener noreferrer');
    }
  };
  if (
    !(
      viewport.isDimensions &&
      viewport.container?.isDimensions
    )
  )
    return null;

  const maxWidth = viewport.container.width;
  const widthStyle = {
    width,
    minWidth: 100,
    maxWidth,
  };
  return (
    <div className="relative container group">
      <label
        className="relative row-space"
        style={widthStyle}
      >
        <div className="hidden group-hover:flex absolute pointer-events-none -inset-1 bg-black-7 rounded-md" />
        <input
          name={INUT_NAME_Q}
          placeholder="EMPTY"
          title="Enter search query"
          ref={onInputRef}
          className="relative text-2xl placeholder-gray w-full truncate"
          value={q}
          onChange={onQChange}
          onKeyDown={handleKeyDown}
        />
        <WorkItemCustomAutocomplete />
        <WorkItemEditButtons isValue={isValue} />
      </label>
    </div>
  );
};
