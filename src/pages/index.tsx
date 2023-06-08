import Head from "next/head"
import CharacterCard from "../components/CharacterCard"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import timeAgo from "../utils/timeAgo"
import { NextPage } from "next"
import { env } from "../env/client.mjs"

const Home: NextPage = () => {
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(-1)
  const [gameOver, setGameOver] = useState<boolean>(false)
  
  const [chars, setChars] = useState<Character[]>([]);

  const [info, setInfo] = useState<Info | null>(null);
  const [isLoading, setLoading] = useState(false);

  const fetchChars = async () => {
    setLoading(true);

    const response = await fetch(env.NEXT_PUBLIC_API_URL + '/chars');
    const data = await response.json() as Character[];

    setLoading(false);

    setChars((prevChars) => [...prevChars, ...data]);
  };

  const popChar = (n = 1) => {
    setChars((prevChars) => {
      const newList = [...prevChars];

      for (let i = 0; i < n; i++) newList.shift();
      if (newList.length <= 5) fetchChars().catch(console.error);

      return newList;
    });
  };

  // prefetch images for next 2 characters
  useEffect(() => {
    // TODO: this fetches the same character twice because of rolling
    // window etc shouldn't be a problem because it's cached
    if (chars.length < 4) return;
 
    new Image().src = env.NEXT_PUBLIC_API_URL + `/img/${chars[2].id}`;
    new Image().src = env.NEXT_PUBLIC_API_URL + `/img/${chars[3].id}`;
  }, [chars]);

  const fetchInfo = async () => {
    const response = await fetch(env.NEXT_PUBLIC_API_URL + '/info');
    const data = await response.json() as {
      updated: string;
      count: number;
    };

    const info = {
      updated: new Date(data.updated),
      count: data.count,
    };

    setInfo(info);
  };

  useEffect(() => {
    fetchChars().catch(console.error);
    fetchInfo().catch(console.error);
    setHighScore(parseInt(Cookies.get("highscore") || "0"))
  }, []);

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
    if (highScore < score) Cookies.set("highscore", score.toString(), { expires: 365 })
  }, [score])

  const reset = () => {
    if (highScore < score) setHighScore(score)
    setScore(0)
    setGameOver(false)
    popChar(2)
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
      <main className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-lg font-semibold text-white">
          <CharacterCard character={chars.length >= 1 && chars[0]} btnPos={"left"} />
          <CharacterCard character={chars.length >= 1 && chars[1]} check={check} btnPos={"right"} />

          <div className="absolute flex flex-col left-2 h-fit my-auto top-0 bottom-0 justify-center md:right-0 md:items-start md:justify-center md:flex-row md:gap-5 md:top-2 md:w-fit md:mx-auto md:left-0 md:bottom-auto">
            <div className="flex flex-row md:flex-col items-end gap-2 md:gap-0 md:w-32">
              <p className="font-bold text-2xl md:text-3xl">{highScore >= 0 ? highScore : "..."}</p>
              <p className="md:-mt-2">highscore</p>
            </div>

            <div className="flex flex-row md:flex-col items-end gap-2 md:gap-0 mb-9 md:mb-0 md:items-start md:w-32">
              <p className="font-bold text-2xl md:text-3xl">{score}</p>
              <p className="md:-mt-2">score</p>
            </div>
          </div>
      </main>
      {gameOver && (
          <button
            className="absolute bottom-0 left-0 right-0 top-0 m-auto h-fit w-40 rounded-sm bg-purple-800 text-white pb-2 pt-1 text-xl font-semibold"
            onClick={() => reset()}
          >
            try again
          </button>
        )}
      <footer className="absolute bottom-0 left-0 right-0 mx-auto mb-1 w-fit text-center text-xs text-white flex flex-col md:text-sm md:flex-row md:gap-2">
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
        <p>serving <span className="font-bold">{info ? info.count : "..."}</span> characters</p>
        <p className="hidden md:block">|</p>
        <p>updated{" "}
          <span
            title={
              info ? 
              info.updated.toLocaleDateString() +
              " " +
              info.updated.toLocaleTimeString() : "..."
            }
            className="font-bold hover:cursor-help"
          >
            {info ? timeAgo(info.updated) : "..."}
          </span></p>
      </footer>
    </>
  )
}

export default Home
