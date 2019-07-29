// @flow
import * as React from 'react';

type Props = {|
  goal: string,
|}

function Goal({goal}: Props) {

  return (
    <>
      <div>{goal}</div>
    </>
  );
}

export default Goal;