
export default function getFieldASTs(info) {
  let fields = [];
  let fieldASTs = info.fieldASTs;
  fieldASTs[0].selectionSet.selections.map(selection => {
    if(!selection.selectionSet) fields.push(selection.name.value);
  });
  return fields;
};
