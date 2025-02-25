import React from "react";

import { useInView } from "react-intersection-observer";
const InfiniteScrooler: React.FC<{
  fetchNextPage: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ fetchNextPage, children, className }) => {
  const { ref, inView } = useInView({
    threshold: 0,
    onChange: (inView) => {
      console.log(inView);

      if (inView) {
        fetchNextPage();
      }
    },
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref}></div>
    </div>
  );
};

export default InfiniteScrooler;
