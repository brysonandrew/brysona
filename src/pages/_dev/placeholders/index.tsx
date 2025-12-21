import { useApp } from '@brysonandrew/app';
import { css, Global } from '@emotion/react';
import { TApp } from '@shell/providers';

export const Placeholders = () => {
  const { PLACEHOLDER } = useApp<TApp>();
  const globalCss = css`
    :root {
      ${PLACEHOLDER.GLOBAL.VARS_CSS}
    }
  `;
  return (
    <div>
      <Global styles={globalCss} />
      <PLACEHOLDER.GLOBAL.ClipPath />
      <ul className='column-stretch gap-4 w-full'>
        {[
          PLACEHOLDER.Blank,
          PLACEHOLDER.Small,
          PLACEHOLDER.Responsive,
        ].map((P, index) => (
          <li
            key={`${index}`}
            className='relative w-full center bg-gray overflow-hidden'
            style={{ height: '60vh' }}
          >
            <P />
          </li>
        ))}
      </ul>
    </div>
  );
};
