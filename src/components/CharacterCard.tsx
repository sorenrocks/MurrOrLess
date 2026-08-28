"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import CountUp from "react-countup"
import beautify from "../utils/beautify"

type Props = {
  character: Character
  check?: (guess: number) => void
  btnPos: "left" | "right" | "hidden"
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

  if (!c) return
  const fullSrc =
    "https://static1.e621.net/data/" +
    `${c.md5.slice(0, 2)}/${c.md5.slice(2, 4)}/${c.md5}.${c.ext}`

  if (btnPos === "hidden") {
    return (
      <div style={{ display: "none" }}>
        <Image
          src={fullSrc}
          alt={"preload"}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          unoptimized={true}
        />
      </div>
    )
  }

  return (
    <div className="relative flex aspect-video w-full flex-1 flex-col items-center justify-center overflow-hidden text-center">
      <Image
        src={fullSrc}
        alt={"full res"}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{
          objectFit: "cover",
        }}
              unoptimized={true}
      />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center bg-black/30 p-4">
        <h1 className="text-4xl font-semibold">
          {c ? beautify(c.char, true) : "..."}
        </h1>
        <h2 className="text-xl font-semibold">
          <span className="font-normal text-gray-300"> from</span>{" "}
          {c ? beautify(c.copy) : "..."}
        </h2>

        <p className="mb-1 mt-5 text-lg text-gray-300">has</p>

        {c && check ? (
          <>
            {active ? (
              <div className="flex flex-col items-center">
                <div
                  className="mb-2 flex h-10 w-56 items-center justify-center rounded-md bg-orange-600 text-2xl font-semibold hover:cursor-pointer md:transition-all md:hover:scale-105"
                  onClick={() => {
                    if (!c) return
                    setActive(false)
                    setTimeout(() => check(1), ease + delay)
                  }}
                >
                  more
                </div>
                <div
                  className="flex h-10 w-56 items-center justify-center rounded-md bg-blue-600 text-2xl font-semibold hover:cursor-pointer md:transition-all md:hover:scale-105"
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

        {c && (
          <a
            href={`https://e926.net/posts/${c.id}`}
            target="_blank"
            rel="noreferrer"
            className="hover:cursor-pointer"
          >
            <button className="rounded-sm bg-zinc-900 bg-opacity-50 px-2 text-sm hover:bg-opacity-100">
              view post
            </button>
          </a>
        )}
      </div>
    </div>
  )
}

export default CharacterCard
