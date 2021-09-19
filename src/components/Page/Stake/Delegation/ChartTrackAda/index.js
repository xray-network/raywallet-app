import React from 'react'
import { useSelector } from 'react-redux'
import { Line } from 'react-chartjs-2'
import { format } from 'utils/utils'

const ChartTrackXray = ({ history, epochCut }) => {
  const theme = useSelector((state) => state.settings.theme)
  const isLight = theme === 'default'

  const datasetProcessed = ([...history] || [])
    .reverse()
    .filter((r) => r.earnedIn.number !== epochCut)

  const chartData = {
    labels: datasetProcessed.map((epoch) => epoch.earnedIn.number),
    datasets: [
      {
        type: 'bar',
        label: 'Epoch Rewards',
        maxBarThickness: 5,
        data: datasetProcessed.map((epoch) => epoch.amount / 1000000),
        fill: true,
        radius: 0,
        width: 2,
        backgroundColor: ['#355aeb'],
        hoverBackgroundColor: ['#355aeb'],
        borderColor: ['#355aeb'],
        postfix: 'ADA',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      axis: 'x',
    },
    scales: {
      x: {
        grid: {
          color: isLight ? '#e4e9f0' : '#2e2e46',
        },
        ticks: {
          autoSkip: true,
          color: isLight ? '#8484AD' : '#4f4f7a',
        },
      },
      y: {
        grid: {
          color: isLight ? '#e4e9f0' : '#2e2e46',
        },
        ticks: {
          color: isLight ? '#8484AD' : '#4f4f7a',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItem) => `Epoch ${tooltipItem[0].label}`,
          label: (tooltipItem) =>
            chartData.datasets.map(
              (ds) => `${ds.label}: ${format(ds.data[tooltipItem.dataIndex], 6)} ${ds.postfix}`,
            ),
        },
      },
    },
  }

  return (
    <div>
      <Line data={chartData} options={options} height={200} />
    </div>
  )
}

export default React.memo(ChartTrackXray)
