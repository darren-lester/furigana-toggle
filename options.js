const hoverOption = document.getElementById('hover-reveal-checkbox');
const colourOption = document.getElementById('colour-checkbox');
const kanjiColourOption = document.getElementById('kanji-colour');
const furiganaColourOption = document.getElementById('furigana-colour');

const defaultOptions = {
  hoverReveal: true,
  colour: false,
  kanjiColour: '#0000ff',
  furiganaColour: '#ff0000'
};

chrome.storage.sync.get(defaultOptions, function(items) {
  if (items.hoverReveal) {
    hoverOption.setAttribute('checked', 'checked');
  } else {
    hoverOption.removeAttribute('checked');
  }

  if (items.colour) {
    colourOption.setAttribute('checked', 'checked');
  } else {
    colourOption.removeAttribute('checked');
  }

  if (items.kanjiColour) {
  	kanjiColourOption.value = items.kanjiColour;
  }

  if (items.furiganaColour) {
  	furiganaColourOption.value = items.furiganaColour;
  }

  setColourOptionDisability();
});

function setColourOptionDisability() {
  if (hoverOption.checked) {
    colourOption.removeAttribute('disabled');
  } else {
    colourOption.setAttribute('disabled', 'disabled');
  }
}

hoverOption.addEventListener('change', function() {
  setColourOptionDisability();
});

const saveButton = document.getElementById('save');
saveButton.addEventListener('click', saveOptions);

function saveOptions() {
  const options = {
    hoverReveal: Boolean(hoverOption.checked),
    colour: Boolean(colourOption.checked),
    kanjiColour: kanjiColourOption.value,
    furiganaColour: furiganaColourOption.value
  };
  chrome.storage.sync.set(options, showSaveNotification);
}

function showSaveNotification() {
  const notification = document.getElementById('notification');
  notification.textContent = 'Options saved';
  setTimeout(function() {
    notification.textContent = '';
  }, 750);
}
