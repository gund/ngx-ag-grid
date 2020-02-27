export enum FilterType {
  text = 'agTextColumnFilter',
  date = 'agDateColumnFilter',
  set = 'agSetColumnFilter',
  number = 'agNumberColumnFilter',
  inRangeTimePicker = 'inRangeTimePicker',
}

export enum FilterOption {
  contains = 'contains',
  inRange = 'inRange',
  equals = 'equals',
  notEqual = 'notEqual',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
  notContains = 'notContains',
  lessThan = 'lessThan',
  lessThanOrEqual = 'lessThanOrEqual',
  greaterThan = 'greaterThan',
  greaterThanOrEqual = 'greaterThanOrEqual',
}

export enum FilterModelType {
  text = 'text',
  date = 'date',
  set = 'set',
  number = 'number',
}

export enum FilterRowsAction {
  none = '',
  keep = 'keep',
}
