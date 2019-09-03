import React from 'react';

function CharInternal({char, bg, borderStyle, isFirst}) {
    const bStyle = borderStyle || 'transparent';
    const largeSide = '16px';
    const smallSide = '8px';

    const style = {
      textAlign: 'center', 
      verticalAlign: 'top', 
      lineHeight: largeSide, 
      fontSize: '12px', 
      display: 'inline-block', 
      width: largeSide, 
      height: smallSide, 
      background: bg || 'white', 
      boxSizing: 'border-box',
      borderLeft: `1px ${isFirst ? 'transparent' : 'solid'} black`,
      borderTop: `1px ${bStyle} black`
    };
  
    return <div style={style}>{char != null ? char : ''}</div>;
  }
  
  const GREEN = '#4caf50';
  const GREEN_200 = '#a5d6a7';
  const GREEN_300 = '#81c784';
  const BLUE = '#2196f3';
  const BLUE_200 = '#81d4fa';
  const AMBER = '#ffc107';
  const AMBER_200 = '#ffe082';
  
  export function Char({score, goal, total, day, isFirst: _isFirst, sum}) {
    let isFirst = _isFirst;
    let bg;
    let borderStyle = null;
    if (day !== undefined) {
      return <CharInternal char={day} isFirst={isFirst} borderStyle={'solid'} />
    } 
    
    if (score === goal && score !== undefined) {
      borderStyle = 'dashed';
    }
    
    // column with 0 result
    if (total === undefined || total === 0) {
      if (score > sum || sum === undefined) {
        bg = 'white';
      } else {
        bg = sum < goal ? AMBER_200 : GREEN_200;
      }
    } else {
  
      if (total >= score) {
        if (sum === undefined) {
          bg = total < goal ? AMBER : GREEN;
        } else {
          bg = sum < goal ? AMBER : GREEN;
        }
      } else {
        if (score > sum || sum === undefined) {
          bg = 'white';
        } else {
          bg = sum < goal ? AMBER_200 : GREEN_200;
        }
      }
    }
    return <CharInternal bg={bg} borderStyle={borderStyle} isFirst={isFirst}/>
  }
  
  export function CharRow({children}) {
    const style = {
      fontSize: '0', 
      whiteSpace: 'nowrap',
    };
    return <div style={style}>{children}</div>;
  }
