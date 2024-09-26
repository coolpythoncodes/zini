import { type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

type Props = {
  itemsCount: number;
  children: ReactNode;
  rootClassName?: string;
};

const ElementList = ({ itemsCount, children, rootClassName }: Props) => {
  return (
    <div className={rootClassName}>
      {Array.from({ length: itemsCount }, (_, index) => 0 + index * 1)?.map(
        (_) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          <div key={uuidv4()}>{children}</div>
        ),
      )}
    </div>
  );
};

export default ElementList;
