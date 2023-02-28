import { useEffect, useState } from "react"
import CountUp from "react-countup"
import beautify from "../utils/beautify"

type Props = {
  character: Character
  check?: (guess: number) => void
  btnPos: "left" | "right"
}

const format = (n: number) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const CharacterCard = ({ character: c, check, btnPos }: Props) => {
  const [active, setActive] = useState<boolean>()

  useEffect(() => {
    setActive(!!check)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c])

  const ease = 800
  const delay = 500

  return (
    <div
      className="h-screen flex-1 flex-col justify-center pt-52 pb-40 text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${c.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="mt-32 text-4xl font-semibold">
        {beautify(c.character, true)}
      </h1>
      <h2 className="text-xl font-semibold">
        <span className="font-normal text-gray-300"> from</span>{" "}
        {beautify(c.copyright)}
      </h2>

      <p className="mt-5 mb-1 text-lg text-gray-300">has</p>

      {check ? (
        <>
          {active ? (
            <div className="flex flex-col items-center">
              <button
                className="w-56 rounded-sm bg-orange-600 py-1 text-2xl font-semibold"
                onClick={() => {
                  setActive(false)
                  setTimeout(() => check(1), ease + delay)
                }}
              >
                more
              </button>
              <button
                className="mt-2 w-56 rounded-sm bg-blue-600 py-1 text-2xl font-semibold"
                onClick={() => {
                  setActive(false)
                  setTimeout(() => check(-1), ease + delay)
                }}
              >
                less
              </button>
            </div>
          ) : (
            <CountUp
              className="text-6xl font-bold"
              end={c.fav_count}
              formattingFn={format}
              duration={ease / 1000}
            />
          )}
        </>
      ) : (
        <p className="text-6xl font-bold">{format(c.fav_count)}</p>
      )}

      <p className="mt-1 text-gray-300">favorites on e621</p>

      <div
        className={`absolute bottom-1 flex ${
          btnPos === "right" ? "right-3" : "left-3"
        }`}
      >
        <a
          href={`https://e926.net/posts/${c.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <button className="rounded bg-gray-800 px-1 text-sm">
            view post
          </button>
        </a>
      </div>
    </div>
  )
}

export default CharacterCard
