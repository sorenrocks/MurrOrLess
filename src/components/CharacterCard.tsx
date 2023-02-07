import { useEffect, useState } from "react"
import CountUp from "react-countup"

type Props = {
  character: Character
  check?: (guess: number) => void
}

const beautify = (s: string, noExtra = false) => {
  let ret = s.replace(/_/g, " ")

  // remove (...)
  if (noExtra) ret = ret.replace(/\(.*\)/g, "")

  // capitalize
  ret = ret.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
  )

  return ret
}

const format = (n: number) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const CharacterCard = ({ character: c, check }: Props) => {
  const [active, setActive] = useState<boolean>()

  useEffect(() => {
    setActive(!!check)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c])

  const ease = 1000
  const delay = 500

  return (
    <div className="h-screen flex-1 flex-col justify-center pt-52 pb-40 text-center">
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
    </div>
  )
}

export default CharacterCard
