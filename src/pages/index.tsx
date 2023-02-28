import type { GetStaticProps } from "next"
import { type NextPage } from "next"
import { parse } from "csv-parse"
import Head from "next/head"
import { readFileSync } from "fs"
import CharacterCard from "../components/CharacterCard"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import timeAgo from "../utils/timeAgo"

type Props = {
  characters: Character[]
  updatedAt: string
}

const Home: NextPage<Props> = ({ characters: _chars, updatedAt }) => {
  const [chars, setChars] = useState<Character[]>([])

  const [idx, setIdx] = useState<number>(0)
  const [a, setA] = useState<Character>()
  const [b, setB] = useState<Character>()
  const [tmp, setTmp] = useState<Character>()

  const [highScore, setHighScore] = useState<number>(
    parseInt(Cookies.get("highscore") || "0"),
  )

  const [attempt, setAttempt] = useState<number>(1)

  const [gameOver, setGameOver] = useState<boolean>(false)

  useEffect(() => {
    setChars(shuffle(_chars))
    setIdx(0)
  }, [_chars, chars, attempt])

  useEffect(() => {
    setA(chars[idx])
    setB(chars[idx + 1])
    setTmp(chars[idx + 2])

    if (highScore < idx)
      Cookies.set("highscore", idx.toString(), { expires: 365 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, chars, attempt])

  // prefetch next image
  useEffect(() => {
    if (tmp) new Image().src = tmp.url
  }, [tmp])

  const check = (guess: number) => {
    if (!a || !b) return null

    const actual = b.fav_count - a.fav_count
    if ((actual > 0 && guess > 0) || (actual < 0 && guess < 0)) {
      setIdx(idx + 1)
    } else {
      setGameOver(true)
    }
  }

  const reset = () => {
    if (highScore < idx) setHighScore(idx)
    setIdx(0)
    setGameOver(false)
    setAttempt(attempt + 1)
  }

  if (!a || !b) return null
  return (
    <>
      <Head>
        <title>MurrOrLess?</title>
        <meta
          name="description"
          content="Guess which character is more popular on e621"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen bg-gray-900 text-lg font-semibold text-white">
        <div className="absolute flex w-screen">
          <div className="mr-3 mt-2 flex-1 flex-col text-end">
            <p className="text-3xl">{highScore}</p>
            <p className="-mt-1">highscore</p>
          </div>
          <div className="ml-3 mt-2 flex-1 justify-start">
            <p className="text-3xl">{idx}</p>
            <p className="-mt-1">score</p>
          </div>
        </div>
        {gameOver && (
          <button
            className="absolute left-0 right-0 top-0 bottom-0 m-auto h-fit w-56 rounded-sm bg-purple-800 pt-1 pb-2 text-xl font-semibold"
            onClick={() => reset()}
          >
            try again
          </button>
        )}
        <div className="flex">
          <CharacterCard character={a} btnPos={"left"} />
          <CharacterCard character={b} check={check} btnPos={"right"} />
        </div>
      </main>
      <footer className="absolute bottom-0 mb-1 w-screen text-center text-sm">
        <p>
          <a
            className="font-bold text-orange-600"
            href="https://github.com/sorenrocks/MurrOrLess"
            target="_blank"
            rel="noreferrer"
          >
            MurrOrLess
          </a>{" "}
          by{" "}
          <a
            className="font-bold text-blue-600"
            href="https://github.com/sorenrocks"
            target="_blank"
            rel="noreferrer"
          >
            soren.rocks
          </a>{" "}
          | serving <span className="font-bold">{chars.length}</span> characters
          | updated{" "}
          <span
            title={new Date(updatedAt).toDateString()}
            className="font-bold hover:cursor-help"
          >
            {timeAgo(new Date(updatedAt))}
          </span>
        </p>
      </footer>
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
    const updatedAtPath = "./data/updated_at.txt"
    const updatedAt = readFileSync(updatedAtPath, "utf8").trim()

    const charsPath = "./data/characters.csv"
    const contents = readFileSync(charsPath, "utf8")

    parse(contents, { columns: true }, (err, records) => {
      if (err) reject(err)

      resolve({
        props: {
          characters: records as Character[],
          updatedAt,
        },
      })
    })
  })
}

export default Home
