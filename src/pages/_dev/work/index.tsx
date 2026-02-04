import { WorkButton } from '@pages/_dev/work/button';
import { UPWORK_BASE } from '@pages/_dev/work/config/constants';
import { WorkFilters } from '@pages/_dev/work/filters';
import { WorkItemCustom } from '@pages/_dev/work/item/custom';
import {
  useWorkState,
  WorkStateProvider,
} from '@pages/_dev/work/context';
import { GlobalCss } from '@shell/global/Css';
import { withProviders } from '@shell/providers/withProviders';
import { WorkItem } from './item';
import { WorkItemLabel } from '@pages/_dev/work/item/label';
import { WorkBox } from '@pages/_dev/work/box';
import { WorkKeywords } from '@pages/_dev/work/keywords';
import './reset.css';
import { ItemClear } from '@pages/_dev/work/item/custom/buttons/clear';
import { WorkGradient } from '@pages/_dev/work/gradient';
import { IconsSave } from '@pages/_dev/work/icons/save';
import { IconsQuery } from '@pages/_dev/work/icons/query';
import { IconsReplace } from '@pages/_dev/work/icons/replace';
import { IconsAppend } from '@pages/_dev/work/icons/append';

const _Work = withProviders(() => {
  const { remove, reset, add, items, isQ, keyRecord } =
    useWorkState();
  const isKeyDown = keyRecord.alt || keyRecord.shift;

  return (
    <div className="center bg-main w-full min-h-screen overflow-x-hidden">
      <GlobalCss />
      <WorkGradient />
      <div className="column-stretch w-full px-5 xxl:w-[900px]">
        <div className="py-6" />
        <div className="row gap-2">
          <h4 className="text-2xl text-gray-8 uppercase">
            Upwork links
          </h4>
          <WorkButton title="Reset list" onClick={reset}>
            ↺
          </WorkButton>
        </div>

        <div className="py-0.25" />
        <h3 className="text-sm text-gray truncate">
          {UPWORK_BASE}?
        </h3>
        <div className="py-4" />
        <WorkFilters>
          {(workCommonState) => (
            <div className="column-stretch gap-4">
              <WorkBox title="Query" Icon={IconsQuery}>
                <WorkItemCustom>
                  {(next) => (
                    <WorkButton
                      title="Add item"
                      disabled={!isQ}
                      onClick={() => {
                        if (!isQ) return;
                        add({
                          ...next,
                          ...workCommonState,
                        });
                      }}
                    >
                      {/* ➕ ⧺ ⧻  */}⨁{/* ＋ */}
                    </WorkButton>
                  )}
                </WorkItemCustom>
              </WorkBox>
              <WorkBox
                title={isKeyDown ? 'Replace' : 'Append'}
                Icon={
                  isKeyDown ? IconsReplace : IconsAppend
                }
                right={<ItemClear />}
              >
                <WorkKeywords />
              </WorkBox>
              <WorkBox title="Saved" Icon={IconsSave}>
                {items.length === 0 ? (
                  <WorkItemLabel title="No entries" />
                ) : (
                  <ul className="column-stretch gap-4">
                    {items.map((item, index) => (
                      <WorkItem key={`${index}`} {...item}>
                        <WorkButton
                          title="Delete item"
                          onClick={() => remove(item.id)}
                        >
                          ⊖{/* 𝕏 */}
                        </WorkButton>
                      </WorkItem>
                    ))}
                  </ul>
                )}
              </WorkBox>
            </div>
          )}
        </WorkFilters>
        <div className="py-6" />
      </div>
      <div className="py-24" />
    </div>
  );
});

export const Work = () => (
  <WorkStateProvider>
    <_Work />
  </WorkStateProvider>
);
