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

export default beautify
