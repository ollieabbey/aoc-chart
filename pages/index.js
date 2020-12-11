import Head from 'next/head'
import styles from '../styles/Home.module.css'
const { DateTime, Duration } = require('luxon');


export default function Home({ data, error }) {
  const getDataForPerson = name => {
    let key
    for (key in data.members) {
      const member = data.members[key]
      if (member.name === name) {
        return member
      }
    }
    return `${name} not found!`
  }

  const getAverageTimeOfCompletionForPerson = (name, part) => {
    const days = getDataForPerson(name).completion_day_level
    const durations = []
    for (const day in days) {
      const millisOpened = DateTime.fromObject(
        {
          year: 2020,
          month: 12,
          day: day,
          hour: 5,
          zone: 'UTC'
        }).toMillis()
      const timestamp = days[day]?.[part].get_star_ts
      const millisToComplete = (timestamp*1000) - (millisOpened)
      durations.push(millisToComplete)
    }

    const avgDuration = Duration.fromMillis(durations.reduce((a,b) => a + b)/ durations.length)
    const hoursMinutesSeconds =  avgDuration.toFormat("h m s").split(' ')
    const hours = hoursMinutesSeconds[0]
    const minutes = hoursMinutesSeconds[1]
    const seconds = hoursMinutesSeconds[2]
    return `${hours} hour${hours == 1 ? '' : 's'}, ${minutes} minute${minutes == 1 ? '' : 's'} and ${seconds} second${seconds == 1 ? '' : 's'}.`
  }

  const name = 'Ollie Abbey'
  const errorText = error && `Error: ${error}`
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Average Times:
        </h1>
      </main>

      <p className={styles.description}>
          {name}:
          <code className={styles.code}>{JSON.stringify(getAverageTimeOfCompletionForPerson(name, "1"))}</code>
        </p>
        <p className={styles.description}>
          {errorText}
        </p>
    </div>
  )
}

export async function getStaticProps() {
  const session = process.env.AOC_SESSION
  if (!session) {
    return {
      props: {
        error: 'No Advent of Code session provided.',
        data: {
          members: {}
        }
      }
    }
  }
  const response = await fetch("https://adventofcode.com/2020/leaderboard/private/view/496748.json", {
    headers: {
      cookie: `session=${session}`
    },
  });
  const data = await response.json()
  return {
    props: {
      data,
    }
  }
}
