import { ResponsiveLine } from '@nivo/line'

const data = [
  {
    "id": "japan",
    "color": "hsl(136, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 67
      },
      {
        "x": "helicopter",
        "y": 194
      },
      {
        "x": "boat",
        "y": 5
      },
      {
        "x": "train",
        "y": 142
      },
      {
        "x": "subway",
        "y": 217
      },
      {
        "x": "bus",
        "y": 180
      },
      {
        "x": "car",
        "y": 73
      },
      {
        "x": "moto",
        "y": 269
      },
      {
        "x": "bicycle",
        "y": 162
      },
      {
        "x": "horse",
        "y": 278
      },
      {
        "x": "skateboard",
        "y": 26
      },
      {
        "x": "others",
        "y": 279
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(310, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 34
      },
      {
        "x": "helicopter",
        "y": 123
      },
      {
        "x": "boat",
        "y": 174
      },
      {
        "x": "train",
        "y": 129
      },
      {
        "x": "subway",
        "y": 155
      },
      {
        "x": "bus",
        "y": 153
      },
      {
        "x": "car",
        "y": 240
      },
      {
        "x": "moto",
        "y": 246
      },
      {
        "x": "bicycle",
        "y": 226
      },
      {
        "x": "horse",
        "y": 7
      },
      {
        "x": "skateboard",
        "y": 40
      },
      {
        "x": "others",
        "y": 228
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(106, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 156
      },
      {
        "x": "helicopter",
        "y": 252
      },
      {
        "x": "boat",
        "y": 146
      },
      {
        "x": "train",
        "y": 71
      },
      {
        "x": "subway",
        "y": 59
      },
      {
        "x": "bus",
        "y": 7
      },
      {
        "x": "car",
        "y": 162
      },
      {
        "x": "moto",
        "y": 49
      },
      {
        "x": "bicycle",
        "y": 104
      },
      {
        "x": "horse",
        "y": 268
      },
      {
        "x": "skateboard",
        "y": 257
      },
      {
        "x": "others",
        "y": 176
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(112, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 99
      },
      {
        "x": "helicopter",
        "y": 30
      },
      {
        "x": "boat",
        "y": 179
      },
      {
        "x": "train",
        "y": 299
      },
      {
        "x": "subway",
        "y": 217
      },
      {
        "x": "bus",
        "y": 244
      },
      {
        "x": "car",
        "y": 213
      },
      {
        "x": "moto",
        "y": 121
      },
      {
        "x": "bicycle",
        "y": 203
      },
      {
        "x": "horse",
        "y": 213
      },
      {
        "x": "skateboard",
        "y": 108
      },
      {
        "x": "others",
        "y": 269
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(351, 70%, 50%)",
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