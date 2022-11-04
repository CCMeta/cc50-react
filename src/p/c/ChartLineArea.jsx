import { ResponsiveLine } from '@nivo/line'

const _data = [
  {
    "id": "rx",
    "data": [
      {
        "x": "plane",
        "y": 105
      },
      {
        "x": "boat",
        "y": 10
      },
      {
        "x": "train",
        "y": 203
      },
      {
        "x": "subway",
        "y": 122
      },
      {
        "x": "bus",
        "y": 164
      },
      {
        "x": "car",
        "y": 163
      },
      {
        "x": "moto",
        "y": 138
      },
      {
        "x": "bicycle",
        "y": 19
      },
      {
        "x": "horse",
        "y": 97
      },
      {
        "x": "skateboard",
        "y": 273
      },
      {
        "x": "others",
        "y": 165
      }
    ]
  },
  {
    "id": "tx",
    "data": [
      {
        "x": "plane",
        "y": 173
      },
      {
        "x": "boat",
        "y": 141
      },
      {
        "x": "train",
        "y": 277
      },
      {
        "x": "subway",
        "y": 108
      },
      {
        "x": "bus",
        "y": 272
      },
      {
        "x": "car",
        "y": 283
      },
      {
        "x": "moto",
        "y": 293
      },
      {
        "x": "bicycle",
        "y": 69
      },
      {
        "x": "horse",
        "y": 298
      },
      {
        "x": "skateboard",
        "y": 299
      },
      {
        "x": "others",
        "y": 214
      }
    ]
  }
]

export const MyResponsiveLine = ({ data }) => (
  <ResponsiveLine
    data={data ?? _data}
    margin={{ top: 20, right: 20, bottom: 30, left: 50 }}
    theme={{ textColor: "#888888" }}
    areaOpacity={0.5}
    axisLeft={{ tickValues: 6 }}
    curve="linear"
    colors={{ scheme: 'paired' }}
    lineWidth={1}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    enableArea={true}
    useMesh={true}
    enableGridX={false}
    enableGridY={false}
  />
)