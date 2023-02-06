import type { GetStaticProps } from "next"
import { type NextPage } from "next"
import { parse } from "csv-parse"
import Head from "next/head"
import { readFileSync } from "fs"
import CharacterCard from "../components/CharacterCard"
import { useState, useEffect } from "react"

type Props = {
  characters: Character[]
}

const Home: NextPage<Props> = ({ characters: _chars }) => {
  const [chars, setChars] = useState<Character[]>([])

  const [idx, setIdx] = useState<number>(0)
  const [a, setA] = useState<Character>()
  const [b, setB] = useState<Character>()

  const [highScore, setHighScore] = useState<number>(0)

  const [attempt, setAttempt] = useState<number>(0)

  useEffect(() => {
    setChars(shuffle(_chars))
    setIdx(0)
  }, [_chars, chars, attempt])

  useEffect(() => {
    setA(chars[idx])
    setB(chars[idx + 1])
  }, [idx, chars])

  const check = (guess: number) => {
    if (!a || !b) return null

    const actual = b.fav_count - a.fav_count
    if ((actual > 0 && guess > 0) || (actual < 0 && guess < 0)) {
      setIdx(idx + 1)
    } else {
      if (highScore < idx) setHighScore(idx)
      setIdx(0)
      setAttempt(attempt + 1)
    }
  }

  if (!a || !b) return null
  return (
    <>
      <Head>
        <title>MurrOrLess</title>
        <meta
          name="description"
          content="Guess which character is more popular on e621"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen bg-gray-900 text-white">
        <div className="flex">
          <div className="mr-2 mt-2 flex-1 flex-col text-end">
            <p>{highScore}</p>
            <p>highscore</p>
          </div>
          <div className="ml-2 mt-2 flex-1 justify-start">
            <p>{idx}</p>
            <p>score</p>
          </div>
        </div>
        <div className="flex">
          <CharacterCard character={a} />
          <CharacterCard character={b} check={check} />
        </div>
      </main>
    </>
  )
}

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    const tmp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = tmp
  }

  return array
}

export const getStaticProps: GetStaticProps = async () => {
  return new Promise((resolve, reject) => {
    const filepath = "./data/characters.csv"
    const contents = readFileSync(filepath, "utf8")

    parse(contents, { columns: true }, (err, records) => {
      if (err) reject(err)

      resolve({
        props: {
          characters: records as Character[],
        },
      })
    })
  })
}

export default Home
