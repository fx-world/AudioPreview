
// Listener for messages received from the background.
messenger.runtime.onMessage.addListener((data, sender) => {
  if (data.command == "hideSpinner") {
    document.getElementById("loader").setAttribute("style", "display:none");
  }

  if (data.command == "prepareMessageBody") {
    let mainDiv = document.createElement("div");
    mainDiv.id = "mainDiv";
    mainDiv.setAttribute("style", "display: flex; flex-direction: column;");

    let firstDiv = document.createElement("div");
    firstDiv.id = "firstDiv";
    firstDiv.setAttribute("style", "flex-grow: 1");
    mainDiv.appendChild(firstDiv);

    let secondDiv = document.createElement("div");
    secondDiv.id = "secondDiv";
    secondDiv.setAttribute("style", "height: 50px;padding-top:5px;");
    mainDiv.appendChild(secondDiv);

    let loader = new Image();
    loader.id = "loader";
    loader.src =
      "data:image/gif;base64,R0lGODlhEAALAPQAAO/v72ZmZtvb29XV1eTk5GhoaGZmZn5+fqurq5mZmcrKynd3d42Nja+vr5ubm8vLy3l5eWdnZ4+Pj+Hh4dra2unp6YODg9zc3Ofn58fHx7u7u9LS0uXl5QAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA";
    loader.style.float = "right";
    secondDiv.appendChild(loader);
    
    // Move content of body into firstDiv.
    while (document.body.firstChild) {
      firstDiv.appendChild(document.body.firstChild);
    }
    // Add mainDiv to empty body.
    document.body.appendChild(mainDiv);
  }

  if (data.command === "addAudioPreview") {
  	let seperator = document.createElement("fieldset");
    seperator.id = "secondDiv";
    seperator.classList.add("moz-mime-attachment-header");
    let legend = document.createElement("legend");
    legend.classList.add("moz-mime-attachment-header-name");
    legend.textContent = data.name;
    seperator.appendChild(legend);
    
    document
      .getElementById("secondDiv")
      .insertBefore(seperator, document.getElementById("loader"));
    
    let audio = new Audio(data.audioDataUrl);    
	  audio.setAttribute("style", "width: 100%;padding-left:5px;padding-right:5px;padding-bottom:15px;box-sizing:border-box;");
	  audio.controls = true;

    // Add the Audio element before the last element.
    document
      .getElementById("secondDiv")
      .insertBefore(audio, document.getElementById("loader"));
  }
});

messenger.runtime.sendMessage({ command: "addInlinePreviews" });