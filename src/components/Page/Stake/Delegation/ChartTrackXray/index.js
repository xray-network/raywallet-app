import React from 'react'
import { useSelector } from 'react-redux'
import { Line } from 'react-chartjs-2'
import { format } from 'utils/utils'

const ChartTrackXray = ({ history }) => {
  const theme = useSelector((state) => state.settings.theme)
  const isLight = theme === 'default'

  const firstIndex = (history || []).findIndex((el) => el.keySnapshot > 0)
  const secondIndex = ([...history].reverse() || []).findIndex((el) => el.keySnapshot > 0)
  const datasetProcessed = (history || []).slice(firstIndex, -secondIndex) || []

  const chartData = {
    labels: datasetProcessed.map((epoch) => epoch.epoch),
    datasets: [
      {
        type: 'bar',
        label: 'Epoch Rewards',
        maxBarThickness: 5,
        data: datasetProcessed.map((epoch) => epoch.accrued),
        fill: true,
        radius: 0,
        width: 2,
        backgroundColor: ['#355aeb'],
        hoverBackgroundColor: ['#355aeb'],
        borderColor: ['#355aeb'],
        postfix: 'XRAY',
      },
      {
        type: 'bar',
        label: 'Active Stake Snapshot',
        hidden: true,
        maxBarThickness: 5,
        data: datasetProcessed.map((epoch) => epoch.keySnapshot / 1000000),
        radius: 0,
        width: 2,
        backgroundColor: ['#355aeb'],
        hoverBackgroundColor: ['#355aeb'],
        borderColor: ['#355aeb'],
        postfix: 'ADA',
      },
      {
        type: 'bar',
        label: 'ADA per 1 XRAY',
        hidden: true,
        maxBarThickness: 5,
        data: datasetProcessed.map((epoch) => epoch.rate / 1000000),
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
          title: (tooltipItem) =>
            `Epoch ${tooltipItem[0].label} (for Epoch ${parseInt(tooltipItem[0].label, 10) - 2})`,
          label: (tooltipItem) =>
            chartData.datasets.map(
              (ds) =>
                `${ds.label}: ${format(
                  ds.data[tooltipItem.dataIndex],
                  ds.postfix === 'ADA' ? 6 : 0,
                )} ${ds.postfix}`,
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
