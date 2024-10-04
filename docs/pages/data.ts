export interface TimelineData {
  groups: Group[];
  items: Item[];
  column_defs: [
    {
      id: string;
      label: string;
    },
  ];
  summary: Attribute[];
  min_date: string; // Date in ISO format (e.g. 2024-01-01)
  max_date: string; // Date in ISO format (e.g. 2024-12-31)
  yearly_totals: {
    id: string;
    year: number;
    attributes: Attribute[];
  }[];
  column_totals: Attribute[]; // id should be column_defs id
}

type Attribute = {
  id: string;
  label: string;
  value: string;
  raw: any;
};

// A Group can contain multiple items
// For now, each group has exactly one item
export interface Group {
  id: string;
  label: string;
  color: string; // any valid css color string
}

export interface Item {
  id: string;
  group: Group['id'];
  label: string;
  start_date: string; // Date in ISO format (e.g. 2024-01-01)
  end_date: string; // Date in ISO format (e.g. 2024-01-01)
  color: string;
  column_data: {
    [key: TimelineData['column_defs'][number]['id']]: {
      // Correctly formatted value (units, symbols included)
      value: string;
      // value before formatting
      raw: any;
    };
  };
}

export const dummyYearlyTotals: TimelineData['yearly_totals'] = [
  {
    id: '0',
    year: 2024,
    attributes: [
      { id: 'budget', label: 'Budget', value: '£10,000', raw: 10000 },
      { id: 'planned_investment', label: 'Planned Invt.', value: '£15,768', raw: 15768 },
      { id: 'co2_impact', label: 'CO2e Impact', value: '23,926 kg', raw: 23926 },
    ],
  },
  {
    id: '1',
    year: 2025,
    attributes: [
      { id: 'budget', label: 'Budget', value: '£10,000', raw: 10000 },
      { id: 'planned_investment', label: 'Planned Invt.', value: '£15,768', raw: 15768 },
      { id: 'co2_impact', label: 'CO2e Impact', value: '23,926 kg', raw: 23926 },
    ],
  },
  {
    id: '2',
    year: 2026,
    attributes: [
      { id: 'budget', label: 'Budget', value: '£10,000', raw: 10000 },
      { id: 'planned_investment', label: 'Planned Invt.', value: '£15,768', raw: 15768 },
      { id: 'co2_impact', label: 'CO2e Impact', value: '23,926 kg', raw: 23926 },
    ],
  },
  {
    id: '3',
    year: 2027,
    attributes: [
      { id: 'budget', label: 'Budget', value: '£10,000', raw: 10000 },
      { id: 'planned_investment', label: 'Planned Invt.', value: '£15,768', raw: 15768 },
      { id: 'co2_impact', label: 'CO2e Impact', value: '23,926 kg', raw: 23926 },
    ],
  },
  {
    id: '4',
    year: 2028,
    attributes: [
      { id: 'budget', label: 'Budget', value: '£10,000', raw: 10000 },
      { id: 'planned_investment', label: 'Planned Invt.', value: '£15,768', raw: 15768 },
      { id: 'co2_impact', label: 'CO2e Impact', value: '23,926 kg', raw: 23926 },
    ],
  },
];
