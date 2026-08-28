"use client"

import Head from "next/head"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import type { NextPage } from "next"
import Papa from "papaparse"

import CharacterCard from "../components/CharacterCard"
import shuffle from "../utils/shuffle"
import timeAgo from "../utils/timeAgo"

const Home: NextPage = () => {
  const [ageCheck, setAgeCheck] = useState<boolean>(false)

  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [updated, setUpdated] = useState<Date>()

  const [chars, setChars] = useState<Character[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setHighScore(parseInt(Cookies.get("highscore") || "0"))
    setAgeCheck(Cookies.get("ageCheck") === "true" || false)

    void fetch("/info.json")
      .then((res) => res.json())
      .then((data) => setUpdated(new Date(data.updated)))

    void fetch("/chars.csv")
      .then((res) => res.text())
      .then((text) => Papa.parse(text))
      .then((result) => {
        const rows = result.data as string[][]
        rows.shift() // skip headers
        result.data = rows.map((row) => ({
          char: row[0],
          copy: row[1],
          favs: parseInt(row[2]),
          id: parseInt(row[3]),
          md5: row[4],
          ext: row[5],
        }))
        shuffle(result.data)
        setChars(result.data as Character[])
      })
  }, [])

  const check = (guess: number) => {
    if (chars.length < idx + 2) return
    const a = chars[idx]
    const b = chars[idx + 1]

    const actual = b.favs - a.favs
    if ((actual > 0 && guess > 0) || (actual < 0 && guess < 0)) {
      setScore(score + 1)
      setIdx(idx + 1)
    } else {
      setGameOver(true)
    }
  }

  useEffect(() => {
    if (highScore < score)
      Cookies.set("highscore", score.toString(), { expires: 365 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  const reset = () => {
    if (highScore < score) setHighScore(score)
    setScore(0)
    setGameOver(false)
    setIdx(idx + 2)
  }

  if (!chars) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-lg font-semibold text-white">
        <h1 className="mb-4 text-3xl font-bold">Loading...</h1>
      </main>
    )
  }

  if (!ageCheck) {
    return (
      <>
        <Head>
          <title>MurrOrLess?</title>
          <meta
            name="description"
            content="Guess which character is more popular on e621"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 pb-10 text-lg font-semibold text-white">
          <div className="flex w-full flex-col items-center justify-center pr-8 pl-8 text-center sm:w-2/3 md:w-1/3">
            <p className="mb-8 text-center">
              This game uses images from e621. <br />
              Despite being tagged as &quot;safe&quot; on there, they are NOT
              manually curated by me, and some may contain suggestive or
              innapropriate content.
            </p>
            <h1 className="mb-4 text-4xl font-bold">Are you 18 or older?</h1>
            <div className="flex flex-col gap-3 md:flex-row md:gap-5">
              <button
                className="w-full rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-400 md:w-fit"
                onClick={() => {
                  window.location.href = "https://soren.rocks"
                }}
              >
                No, get me out of here!
              </button>
              <button
                className="w-full rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-500 md:w-fit"
                onClick={() => {
                  setAgeCheck(true)
                  Cookies.set("ageCheck", "true", { expires: 365 })
                }}
              >
                Yes, let me play!
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>MurrOrLess?</title>
        <meta
          name="description"
          content="Guess which character is more popular on e621"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gray-900 text-lg font-semibold text-white md:flex-row">
        <CharacterCard character={chars[idx]} btnPos={"left"} />
        <CharacterCard
          character={chars[idx + 1]}
          check={check}
          btnPos={"right"}
        />
        <CharacterCard character={chars[idx + 2]} btnPos={"hidden"} />
        <CharacterCard character={chars[idx + 3]} btnPos={"hidden"} />

        <div className="absolute top-0 bottom-0 left-2 z-10 my-auto flex h-fit flex-col justify-center md:top-2 md:right-0 md:bottom-auto md:left-0 md:mx-auto md:w-fit md:flex-row md:items-start md:justify-center md:gap-5">
          <div className="flex flex-row items-end gap-2 md:w-32 md:flex-col md:gap-0">
            <p className="text-2xl font-bold md:text-3xl">{highScore}</p>
            <p className="md:-mt-2">highscore</p>
          </div>

          <div className="mb-9 flex flex-row items-end gap-2 md:mb-0 md:w-32 md:flex-col md:items-start md:gap-0">
            <p className="text-2xl font-bold md:text-3xl">{score}</p>
            <p className="md:-mt-2">score</p>
          </div>
        </div>
      </main>

      {gameOver && (
        <button
          className="absolute top-0 right-0 bottom-0 left-0 z-10 m-auto h-fit w-40 rounded-sm bg-purple-800 pt-1 pb-2 text-xl font-semibold text-white hover:cursor-pointer"
          onClick={() => reset()}
        >
          try again
        </button>
      )}

      <footer className="absolute right-0 bottom-0 left-0 z-10 mx-auto mb-1 flex w-fit flex-col text-center text-xs text-white md:flex-row md:gap-2 md:text-sm">
        <p>
          <a
            className="font-bold text-orange-400"
            href="https://github.com/sorenrocks/MurrOrLess"
            target="_blank"
            rel="noreferrer"
          >
            MurrOrLess
          </a>{" "}
          by{" "}
          <a
            className="font-bold text-blue-300"
            href="https://github.com/sorenrocks"
            target="_blank"
            rel="noreferrer"
          >
            soren.rocks
          </a>{" "}
        </p>
        <p className="hidden md:block">|</p>
        <p>
          <span className="font-bold">{chars.length}</span> characters
              </p>
              <p className="hidden md:block">|</p>
              <p>
                updated <span className="font-bold">{updated && timeAgo(updated)}</span>
              </p>
      </footer>
    </>
  )
}

export default Home
