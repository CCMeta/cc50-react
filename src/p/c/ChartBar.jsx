
import { ResponsiveBar } from '@nivo/bar'

const localData = [
  {
    "country": "AD",
    "hot dog": 192,
    "hot dogColor": "hsl(319, 70%, 50%)",
    "burger": 192,
    "burgerColor": "hsl(197, 70%, 50%)",
    "sandwich": 71,
    "sandwichColor": "hsl(265, 70%, 50%)",
    "kebab": 2,
    "kebabColor": "hsl(34, 70%, 50%)",
    "fries": 18,
    "friesColor": "hsl(46, 70%, 50%)",
    "donut": 74,
    "donutColor": "hsl(53, 70%, 50%)"
  },
  {
    "country": "AE",
    "hot dog": 30,
    "hot dogColor": "hsl(89, 70%, 50%)",
    "burger": 200,
    "burgerColor": "hsl(347, 70%, 50%)",
    "sandwich": 96,
    "sandwichColor": "hsl(192, 70%, 50%)",
    "kebab": 93,
    "kebabColor": "hsl(147, 70%, 50%)",
    "fries": 163,
    "friesColor": "hsl(32, 70%, 50%)",
    "donut": 48,
    "donutColor": "hsl(45, 70%, 50%)"
  },
  {
    "country": "AF",
    "hot dog": 61,
    "hot dogColor": "hsl(215, 70%, 50%)",
    "burger": 127,
    "burgerColor": "hsl(182, 70%, 50%)",
    "sandwich": 25,
    "sandwichColor": "hsl(58, 70%, 50%)",
    "kebab": 130,
    "kebabColor": "hsl(109, 70%, 50%)",
    "fries": 72,
    "friesColor": "hsl(305, 70%, 50%)",
    "donut": 159,
    "donutColor": "hsl(326, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 17,
    "hot dogColor": "hsl(262, 70%, 50%)",
    "burger": 54,
    "burgerColor": "hsl(156, 70%, 50%)",
    "sandwich": 159,
    "sandwichColor": "hsl(229, 70%, 50%)",
    "kebab": 53,
    "kebabColor": "hsl(266, 70%, 50%)",
    "fries": 104,
    "friesColor": "hsl(157, 70%, 50%)",
    "donut": 103,
    "donutColor": "hsl(157, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 13,
    "hot dogColor": "hsl(177, 70%, 50%)",
    "burger": 126,
    "burgerColor": "hsl(305, 70%, 50%)",
    "sandwich": 183,
    "sandwichColor": "hsl(115, 70%, 50%)",
    "kebab": 183,
    "kebabColor": "hsl(21, 70%, 50%)",
    "fries": 113,
    "friesColor": "hsl(8, 70%, 50%)",
    "donut": 121,
    "donutColor": "hsl(341, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": 28,
    "hot dogColor": "hsl(174, 70%, 50%)",
    "burger": 13,
    "burgerColor": "hsl(296, 70%, 50%)",
    "sandwich": 16,
    "sandwichColor": "hsl(232, 70%, 50%)",
    "kebab": 114,
    "kebabColor": "hsl(157, 70%, 50%)",
    "fries": 31,
    "friesColor": "hsl(38, 70%, 50%)",
    "donut": 14,
    "donutColor": "hsl(195, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 111,
    "hot dogColor": "hsl(360, 70%, 50%)",
    "burger": 7,
    "burgerColor": "hsl(329, 70%, 50%)",
    "sandwich": 101,
    "sandwichColor": "hsl(218, 70%, 50%)",
    "kebab": 74,
    "kebabColor": "hsl(68, 70%, 50%)",
    "fries": 46,
    "friesColor": "hsl(299, 70%, 50%)",
    "donut": 16,
    "donutColor": "hsl(228, 70%, 50%)"
  }
]

export const MyResponsiveBar = ({ data }) => (
  <ResponsiveBar
    data={localData}
    keys={[
      'hot dog',
      'burger',
      'sandwich',
      'kebab',
      'fries',
      'donut'
    ]}
    layers={['grid', 'axes', 'bars', 'markers', 'annotations']}
    indexBy="country"
    margin={{ top: 10, right: 5, bottom: 5, left: 50 }}
    padding={0.3}
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={{ scheme: 'nivo' }}
    defs={[
      {
        id: 'dots',
        type: 'patternDots',
        background: 'inherit',
        color: '#38bcb2',
        size: 4,
        padding: 1,
        stagger: true
      },
      {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: '#eed312',
        rotation: -45,
        lineWidth: 6,
        spacing: 10
      }
    ]}
    fill={[
      {
        match: {
          id: 'fries'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'sandwich'
        },
        id: 'lines'
      }
    ]}
    borderColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          1.6
        ]
      ]
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'country',
      legendPosition: 'middle',
      legendOffset: 32
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'food',
      legendPosition: 'middle',
      legendOffset: -40
    }}
    enableLabel={false}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          1.6
        ]
      ]
    }}
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: 'left-to-right',
        itemOpacity: 0.85,
        symbolSize: 2,
        effects: [
          {
            on: 'hover',
            style: {
              itemOpacity: 1
            }
          }
        ]
      }
    ]}
    role="application"
    ariaLabel="Nivo bar chart demo"
    barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in country: " + e.indexValue }}
  />
)