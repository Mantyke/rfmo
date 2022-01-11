import React from 'react';
import { useMemoizedFn } from 'ahooks';

import MainViewMenu from '@/pages/mine/components/MainViewMenu';
import { get_list_issues } from '@/services/githubApi';
import MineStoreContainer from '@/store/MineStoreContainer';
import MemoCard from './MemoCard';
import MemoEditor from './MemoEditor';

import type { MemoCardProps } from './MemoCard';

import Styles from '../view.module.less';
import MemoStyles from './Memo.module.less';

const Memo = () => {
  const { memoList, setMemoList } = MineStoreContainer.usePicker(['memoList', 'setMemoList']);

  const memosRef = React.useRef<HTMLDivElement>(null);
  const [memosTop, setMemosTop] = React.useState(0);

  const initList = useMemoizedFn(async () => {
    const res = await get_list_issues();
    setMemoList(res);
  });

  React.useEffect(() => {
    if (memosRef.current) {
      const { top } = memosRef.current.getBoundingClientRect();
      setMemosTop(top);
    }

    initList();
  }, [initList]);

  return (
    <>
      <div className={Styles.topBar}>
        <div className={Styles.left}>
          <MainViewMenu />
          <span>MEMO</span>
        </div>

        <span>🔍</span>
      </div>
      <div className={Styles.input}>
        <MemoEditor />
      </div>

      <div
        ref={memosRef}
        className={MemoStyles.memos}
        style={{ height: `calc(100vh - ${memosTop}px)` }}
      >
        {memoList.map((item: MemoCardProps['item']) => {
          return <MemoCard key={item.id} item={item} />;
        })}
      </div>
    </>
  );
};

export default Memo;
