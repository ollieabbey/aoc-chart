import Head from 'next/head'
import styles from '../styles/Home.module.css'

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
          Identity Advent of Code Leaderboard
        </h1>
      </main>

      <p className={styles.description}>
          {name}:
          <code className={styles.code}>{JSON.stringify(getDataForPerson(name))}</code>
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
