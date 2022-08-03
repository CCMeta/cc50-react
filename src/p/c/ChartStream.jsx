
import { ResponsiveStream } from '@nivo/stream'

const localData = [
  {
    "Raoul": 159,
    "Josiane": 30,
    "Marcel": 13,
    "René": 16,
    "Paul": 167,
    "Jacques": 23
  },
  {
    "Raoul": 89,
    "Josiane": 153,
    "Marcel": 69,
    "René": 83,
    "Paul": 119,
    "Jacques": 114
  },
  {
    "Raoul": 116,
    "Josiane": 80,
    "Marcel": 105,
    "René": 177,
    "Paul": 147,
    "Jacques": 10
  },
  {
    "Raoul": 134,
    "Josiane": 28,
    "Marcel": 112,
    "René": 37,
    "Paul": 154,
    "Jacques": 28
  },
  {
    "Raoul": 169,
    "Josiane": 143,
    "Marcel": 116,
    "René": 142,
    "Paul": 58,
    "Jacques": 25
  },
  {
    "Raoul": 106,
    "Josiane": 197,
    "Marcel": 13,
    "René": 106,
    "Paul": 74,
    "Jacques": 169
  },
  {
    "Raoul": 155,
    "Josiane": 47,
    "Marcel": 79,
    "René": 197,
    "Paul": 121,
    "Jacques": 45
  },
  {
    "Raoul": 64,
    "Josiane": 102,
    "Marcel": 105,
    "René": 142,
    "Paul": 170,
    "Jacques": 121
  },
  {
    "Raoul": 126,
    "Josiane": 66,
    "Marcel": 27,
    "René": 153,
    "Paul": 137,
    "Jacques": 77
  }
]

export const MyResponsiveStream = ({ data }) => (
  <ResponsiveStream
    data={data}
    keys={['cpu', 'mem']}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: '',
      legendOffset: 36
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: '',
      legendOffset: -40
    }}
    enableGridX={true}
    enableGridY={true}
    offsetType="silhouette"
    colors={{ scheme: 'nivo' }}
    fillOpacity={0.85}
    borderColor={{ theme: 'background' }}
    defs={[
      {
        id: 'dots',
        type: 'patternDots',
        background: 'inherit',
        color: '#2c998f',
        size: 4,
        padding: 2,
        stagger: true
      },
      {
        id: 'squares',
        type: 'patternSquares',
        background: 'inherit',
        color: '#e4c912',
        size: 6,
        padding: 2,
        stagger: true
      }
    ]}
    fill={[
      {
        match: {
          id: 'Paul'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'Marcel'
        },
        id: 'squares'
      }
    ]}
    dotSize={8}
    dotColor={{ from: 'color' }}
    dotBorderWidth={2}
    dotBorderColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          0.7
        ]
      ]
    }}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        translateX: 100,
        itemWidth: 80,
        itemHeight: 20,
        itemTextColor: '#CCCCCC',
        symbolSize: 12,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemTextColor: '#000000'
            }
          }
        ]
      }
    ]}
  />
)