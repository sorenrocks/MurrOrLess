import Head from "next/head"
import CharacterCard from "../components/CharacterCard"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import timeAgo from "../utils/timeAgo"
import { NextPage } from "next"
import { env } from "../env/client.mjs"

const Home: NextPage = () => {
  const [ageCheck, setAgeCheck] = useState<boolean>(false)

  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)

  const [chars, setChars] = useState<Character[]>([])

  const [info, setInfo] = useState<Info | null>(null)
  const [isLoading, setLoading] = useState(false)

  const fetchChars = async () => {
    setLoading(true)

    const response = await fetch(env.NEXT_PUBLIC_API_URL + "/chars")
    const data = (await response.json()) as Character[]

    setChars((prevChars) => [...prevChars, ...data])
  }

  const popChar = (n = 1) => {
    setChars((prevChars) => {
      const newList = [...prevChars]

      for (let i = 0; i < n; i++) newList.shift()
      if (newList.length <= 5) fetchChars().catch(console.error)

      return newList
    })
  }

  // prefetch images for next 2 characters
  useEffect(() => {
    // TODO: this fetches the same character twice because of rolling
    // window etc shouldn't be a problem because it's cached
    if (chars.length < 4) return

    new Image().src = env.NEXT_PUBLIC_API_URL + `/img/${chars[2].id}`
    new Image().src = env.NEXT_PUBLIC_API_URL + `/img/${chars[3].id}`
  }, [chars])

  const fetchInfo = async () => {
    const response = await fetch(env.NEXT_PUBLIC_API_URL + "/info")
    const data = (await response.json()) as {
      updated: string
      count: number
    }

    const info = {
      updated: new Date(data.updated),
      count: data.count,
    }

    setInfo(info)
  }

  useEffect(() => {
    fetchChars().catch(console.error)
    fetchInfo().catch(console.error)
    setHighScore(parseInt(Cookies.get("highscore") || "0"))
    setAgeCheck(Cookies.get("ageCheck") === "true" || false)
    setLoading(false)
  }, [])

  const check = (guess: number) => {
    if (chars.length < 2) return
    const [a, b] = chars

    const actual = b.favs - a.favs
    if ((actual > 0 && guess > 0) || (actual < 0 && guess < 0)) {
      setScore(score + 1)
      popChar()
    } else {
      setGameOver(true)
    }
  }

  useEffect(() => {
    if (highScore < score)
      Cookies.set("highscore", score.toString(), { expires: 365 })
  }, [score])

  const reset = () => {
    if (highScore < score) setHighScore(score)
    setScore(0)
    setGameOver(false)
    popChar(2)
  }

  if (isLoading) {
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
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-lg font-semibold text-white">
          <div className="flex w-2/5 flex-col items-center justify-center text-center">
            <p className="mb-8 text-center">
              This game uses images from e621. <br />
              Despite being tagged as "safe" on there, they are NOT manually
              curated by me, and some may contain suggestive or innapropriate
              content.
            </p>
            <h1 className="mb-4 text-4xl font-bold">Are you 18 or older?</h1>
            <div className="flex gap-5">
              <button
                className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-400"
                onClick={() => {
                  window.location.href = "https://soren.rocks"
                }}
              >
                No, get me out of here!
              </button>
              <div className="flex gap-4">
                <button
                  className="rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-500"
                  onClick={() => {
                    setAgeCheck(true)
                    Cookies.set("ageCheck", "true", { expires: 365 })
                  }}
                >
                  Yes, let me play!
                </button>
              </div>
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gray-900 text-lg font-semibold text-white md:flex-row">
        <CharacterCard
          character={chars.length >= 1 && chars[0]}
          btnPos={"left"}
        />
        <CharacterCard
          character={chars.length >= 1 && chars[1]}
          check={check}
          btnPos={"right"}
        />

        <div className="absolute bottom-0 left-2 top-0 my-auto flex h-fit flex-col justify-center md:bottom-auto md:left-0 md:right-0 md:top-2 md:mx-auto md:w-fit md:flex-row md:items-start md:justify-center md:gap-5">
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
          className="absolute bottom-0 left-0 right-0 top-0 m-auto h-fit w-40 rounded-sm bg-purple-800 pb-2 pt-1 text-xl font-semibold text-white"
          onClick={() => reset()}
        >
          try again
        </button>
      )}
      <footer className="absolute bottom-0 left-0 right-0 mx-auto mb-1 flex w-fit flex-col text-center text-xs text-white md:flex-row md:gap-2 md:text-sm">
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
          serving <span className="font-bold">{info ? info.count : "..."}</span>{" "}
          characters
        </p>
        <p className="hidden md:block">|</p>
        <p>
          updated{" "}
          <span
            title={
              info
                ? info.updated.toLocaleDateString() +
                  " " +
                  info.updated.toLocaleTimeString()
                : "..."
            }
            className="font-bold hover:cursor-help"
          >
            {info ? timeAgo(info.updated) : "..."}
          </span>
        </p>
      </footer>
    </>
  )
}

export default Home
