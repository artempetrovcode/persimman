function splitText(
  text,
  wrap: (t: string, index: number) => any,
  wrapTag: (t: string, index: number) => any
): $ReadOnlyArray<any> {
    const spans = [];  
    const regex = RegExp('@[a-z]+','g');
    let array1;
    let lastTagEndIndex = 0;
    let index = 0;

    // todo remove empty strings
    while ((array1 = regex.exec(text)) !== null) {
      if (array1 == null) {
        continue;
      }
 
      // before tag
      if (lastTagEndIndex !== array1.index) {
        spans.push(wrap(text.substring(lastTagEndIndex, array1.index), index++));
      }

      // tag
      lastTagEndIndex = array1.index + array1[0].length;
      if (lastTagEndIndex !== array1.index) {
        spans.push(wrapTag(text.substring(array1.index, lastTagEndIndex), index++));    
      }
    }

    // after the last tag
    if (lastTagEndIndex !== text.length) {
      spans.push(wrap(text.substring(lastTagEndIndex), index++));
    }

    return spans;
  }
/*
  function test(text) {
    const spl = splitText(text, s => s, s => s);
    if (spl.join('') === text) {
      console.log('PASS', text)
    } else {
      console.warn('FAIL', '"' + text + '"', spl)
    }
  }

  test('table')
  test('  table  ')
  test(`  
table
  `)
  test('table table2')
  test('   table    table2  ')
    test(`  
table

table2
  `)
  test('@table')
  test('  @table  ')
  test('  @table  @table  ')
  test(`  
  @table
    @table
`)
  test('  @table table  @table  table @table     table')
  */

  export default splitText;