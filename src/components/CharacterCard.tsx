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
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  )

  return ret
}

const CharacterCard = ({ character: c, check }: Props) => {
  return (
    <div className="mt-64 flex-1 flex-col justify-center pb-40 text-center">
      <h1 className="text-4xl font-semibold">{beautify(c.character, true)}</h1>
      <h2 className="text-xl">
        <span className="text-gray-400">from</span> {beautify(c.copyright)}
      </h2>

      <p className="mt-5 mb-1 text-lg text-gray-400">has</p>

      {check ? (
        <div className="flex flex-col items-center">
          <button
            className="w-56 bg-orange-600 py-1 text-2xl font-semibold"
            onClick={() => check(1)}
          >
            more
          </button>
          <button
            className="mt-2 w-56 bg-blue-600 py-1 text-2xl font-semibold"
            onClick={() => check(-1)}
          >
            less
          </button>
        </div>
      ) : (
        <p className="text-6xl font-bold">{c.fav_count}</p>
      )}

      <p className="mt-1 text-gray-400">favorites on e621</p>
    </div>
  )
}

export default CharacterCard
