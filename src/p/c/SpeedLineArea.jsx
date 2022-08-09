import { ResponsiveLine } from '@nivo/line'

const data = [

  {
    "id": "norway",
    "color": "hsl(120, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 210
      },
      {
        "x": "helicopter",
        "y": 293
      },
      {
        "x": "boat",
        "y": 54
      },
      {
        "x": "train",
        "y": 67
      },
      {
        "x": "subway",
        "y": 86
      },
      {
        "x": "bus",
        "y": 30
      },
      {
        "x": "car",
        "y": 254
      },
      {
        "x": "moto",
        "y": 233
      },
      {
        "x": "bicycle",
        "y": 280
      },
      {
        "x": "horse",
        "y": 199
      },
      {
        "x": "skateboard",
        "y": 270
      },
      {
        "x": "others",
        "y": 206
      }
    ]
  }
]

export const MyResponsiveLine = ({ _data }) => (
  <ResponsiveLine
    enablePoints={false}
    data={data}
    margin={{ top: 0, right: 20, bottom: 0, left: 50 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'transportation',
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'count',
      legendOffset: -40,
      legendPosition: 'middle'
    }}
    pointColor="#FFF"
    pointBorderWidth={1}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    enableArea={true}
    areaBlendMode="darken"
    areaOpacity={0.6}
    useMesh={true}
    legends={[]}
  />
)