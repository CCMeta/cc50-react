import { ResponsivePie } from '@nivo/pie'

const data = [
  {
    "id": "stylus",
    "label": "stylus",
    "value": 267,
    "color": "hsl(67, 70%, 50%)"
  },
  {
    "id": "sass",
    "label": "sass",
    "value": 390,
    "color": "hsl(84, 70%, 50%)"
  },
  {
    "id": "haskell",
    "label": "haskell",
    "value": 557,
    "color": "hsl(42, 70%, 50%)"
  }
]

export const MyResponsivePie = ({ _data }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    innerRadius={0.8}
    padAngle={1}
    cornerRadius={5}
    activeOuterRadiusOffset={8}
    colors={{ scheme: 'pastel2' }}
    enableArcLinkLabels={false}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    enableArcLabels={false}
    arcLabelsSkipAngle={10}
  />
)