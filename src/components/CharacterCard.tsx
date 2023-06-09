import { useEffect, useState } from "react"
import CountUp from "react-countup"
import beautify from "../utils/beautify"
import { env } from "../env/client.mjs"

type Props = {
  character: Character | false
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
      className="flex-1 flex flex-col justify-center text-center items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), ${c ? `url(${env.NEXT_PUBLIC_API_URL}/img/${c.id})` : "none"}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-4xl font-semibold">{c ? beautify(c.char, true) : "..."}</h1>
      <h2 className="text-xl font-semibold">
        <span className="font-normal text-gray-300"> from</span>{" "}
        {c ? beautify(c.copy) : "..."}
      </h2>

      <p className="mb-1 mt-5 text-lg text-gray-300">has</p>

      {(c && check) ? (
        <>
          {active ? (
            <div className="flex flex-col items-center">
              <div
                className="w-56 flex justify-center items-center rounded-md bg-orange-600 h-10 text-2xl font-semibold md:hover:scale-105 md:transition-all mb-2 hover:cursor-pointer"
                onClick={() => {
                  if (!c) return
                  setActive(false)
                  setTimeout(() => check(1), ease + delay)
                }}
              >
                more
              </div>
              <div
                className="w-56 flex justify-center items-center rounded-md bg-blue-600 h-10 text-2xl font-semibold md:hover:scale-105 md:transition-all hover:cursor-pointer"
                onClick={() => {
                  if (!c) return
                  setActive(false)
                  setTimeout(() => check(-1), ease + delay)
                }}
              >
                less
              </div>
            </div>
          ) : (
            <CountUp
              className="text-6xl font-bold"
              end={c.favs}
              formattingFn={format}
              duration={ease / 1000}
            />
          )}
        </>
      ) : (
        <p className="text-6xl font-bold">{c ? format(c.favs) : "..."}</p>
      )}

      <p className="mt-1 text-gray-300">favorites on e621</p>

      { c &&
        <a href={`https://e926.net/posts/${c.id}`} target="_blank"
        rel="noreferrer" className="hover:cursor-pointer">
        <button className="rounded-sm bg-zinc-900 bg-opacity-50 px-2 text-sm hover:bg-opacity-100">
          view post
        </button>
        </a>
      }
    </div>
  )
}

export default CharacterCard
