
import { ResponsiveBar } from '@nivo/bar'

const _data = [
  {
    "date": "MON", "DL": 92, "UL": 92,
  },
  {
    "date": "TUR", "UL": 200, "DL": 96,
  },
  {
    "date": "THR", "DL": 43, "UL": 184,
  },
  {
    "date": "WES", "DL": 84, "UL": 50,
  },
  {
    "date": "FRI", "DL": 91, "UL": 133,
  },
  {
    "date": "SAT", "DL": 150, "UL": 50,
  },
  {
    "date": "SUN", "DL": 139, "UL": 99,
  }
]

export const MyResponsiveBar = ({ data }) => (
  <ResponsiveBar
    data={data ?? _data}
    keys={[
      'UL',
      'DL'
    ]}
    axisLeft={{
      tickValues: [0, 50, 100, 150, 200, 250]
    }}
    layers={['grid', 'axes', 'bars', '', '']}
    borderRadius={2}
    indexBy="date"
    margin={{ top: 10, right: 5, bottom: 25, left: 50 }}
    padding={0.5}
    colors={{ scheme: 'pastel2' }}
    enableLabel={false}
  />
)