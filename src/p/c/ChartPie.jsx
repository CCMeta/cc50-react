import { ResponsivePie } from '@nivo/pie'

const data = [
  {
    "id": "lisp",
    "label": "lisp",
    "value": 54,
    "color": "hsl(154, 70%, 50%)"
  },
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
  },
  {
    "id": "java",
    "label": "java",
    "value": 26,
    "color": "hsl(156, 70%, 50%)"
  }
]

export const MyResponsivePie = ({ _data }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    innerRadius={0.8}
    padAngle={1}
    cornerRadius={5}
    activeOuterRadiusOffset={8}
    colors={{ scheme: 'pastel2' }}
    borderWidth={1}
    borderColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          '0.5'
        ]
      ]
    }}
    enableArcLinkLabels={false}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    enableArcLabels={false}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: 'color',
      modifiers: [
        [
          'darker',
          2
        ]
      ]
    }}
    defs={[
      {
        id: 'dots',
        type: 'patternDots',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        size: 4,
        padding: 1,
        stagger: true
      },
      {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        rotation: -45,
        lineWidth: 6,
        spacing: 10
      }
    ]}
    fill={[
      {
        match: {
          id: 'ruby'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'c'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'go'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'python'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'scala'
        },
        id: 'lines'
      },
      {
        match: {
          id: 'lisp'
        },
        id: 'lines'
      },
      {
        match: {
          id: 'elixir'
        },
        id: 'lines'
      },
      {
        match: {
          id: 'javascript'
        },
        id: 'lines'
      }
    ]}
    legends={[]}
  />
)