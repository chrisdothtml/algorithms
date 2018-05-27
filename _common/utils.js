// loop that uses requestAnimationFrame.
// returning `stop` will break the loop
export function RAFLoop (callback) {
  const RAF = window.requestAnimationFrame

  function wrapperCallback () {
    if (callback() !== 'stop') {
      RAF(wrapperCallback)
    }
  }

  RAF(wrapperCallback)
}
