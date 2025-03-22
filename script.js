let audioLoop 

document.addEventListener("DOMContentLoaded", function () {
  const imageElement = document.getElementById("swapImage")
  const dontTouchMe = document.getElementById("dontTouchMe")

  const originalImage = "cat.gif"
  const alternateImage = "spining.gif"
  imageElement.src = originalImage


  document.addEventListener("mousedown", function () {
    imageElement.src = alternateImage
    audioLoop.play()
    dontTouchMe.style.display = "none" 

  })

  document.addEventListener("mouseup", function () {
    imageElement.src = originalImage
    audioLoop.stop()
  })

  document.addEventListener(
    "touchstart",
    function (e) {
      imageElement.src = alternateImage
      audioLoop.play()
      dontTouchMe.style.display = "none" 
    },
    { passive: true },
  )

  document.addEventListener("touchend", function () {
    imageElement.src = originalImage
    audioLoop.stop()
  })

  document.addEventListener("touchcancel", function () {
    imageElement.src = originalImage
    audioLoop.stop()
  })
})

;(function () {
  function loopify(uri, cb) {
    var context = new (window.AudioContext || window.webkitAudioContext)(),
      request = new XMLHttpRequest()

    request.responseType = "arraybuffer"
    request.open("GET", uri, true)

    request.onerror = function () {
      cb(new Error("Couldn't load audio from " + uri))
    }

    request.onload = function () {
      context.decodeAudioData(request.response, success, function (err) {
        cb(new Error("Couldn't decode audio from " + uri))
      })
    }

    request.send()

    function success(buffer) {
      var source

      function play() {
        stop()

        source = context.createBufferSource()
        source.connect(context.destination)

        source.buffer = buffer
        source.loop = true

        source.start(0)
      }

      function stop() {
        if (source) {
          source.stop()
          source = null
        }
      }

      cb(null, {
        play: play,
        stop: stop,
      })
    }
  }

  loopify.version = "0.1"

  if (typeof define === "function" && define.amd) {
    define(function () {
      return loopify
    })
  } else if (typeof module === "object" && module.exports) {
    module.exports = loopify
  } else {
    this.loopify = loopify
  }
})()

loopify("./oiia.wav", ready)

function ready(err, loop) {
  if (err) {
    console.warn(err)
  }

  audioLoop = loop

}
