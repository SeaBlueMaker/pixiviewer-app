const { default: alphabet } = require("./constants/alphabet");

const novelHeaderId = "gtm-novel-work-scroll-begin-reading";
const translationButtonClassName = "translation_button";
const papagoTranslatedWindowId = "txtTarget";

let documentObserver = null;
let isTranslated = false;

const changeAlpabetToAfterWord = (node) => {
  const translatedText = node.innerHTML;

  setTimeout(() => {
    whale.storage.local.get("vocabularyList", ({ vocabularyList }) => {
      const wordChangedText = vocabularyList.reduce(
        (previousText, currentWord, index) => {
          const tempWord = alphabet[index] + alphabet[index];
          const replacedText = previousText.replaceAll(tempWord, currentWord.after);

          return replacedText;
        },
        translatedText
      );

      node.innerHTML = wordChangedText;
      isTranslated = true;
    });
  }, 2000);
};

const createButton = (text) => {
  const $button = document.createElement("button");
  let copied = text;

  $button.classList.add(translationButtonClassName);
  $button.textContent = "번역하기";
  $button.onclick = () => {
    String.prototype.replaceAll = function (before, after) {
      return this.split(before).join(after);
    }

    const spacedText = copied.replaceAll("<br>","%0A");

    const openPapago = () => {
      const changeBeforeWordToAlphabet = (list) => {
        return list.reduce(
          (previousText, currentWord, index) => {
            const tempWord = alphabet[index] + alphabet[index];
            const replacedText = previousText.replaceAll(currentWord.before, tempWord);

            return replacedText;
          },
          spacedText
        );
      };

      whale.storage.local.get("vocabularyList", ({ vocabularyList }) => {
        let text = null;

        if (vocabularyList) {
          text = changeBeforeWordToAlphabet(vocabularyList);
        } else {
          text = spacedText;
        }

        window.open(`https://papago.naver.com/?sk=auto&tk=ko&st=${text}`, "_blank", "whale-sidebar");
      });
    };

    openPapago();
  };

  return $button;
};

const insertButton = ($el) => {
  const text = $el.parentNode.querySelector("p").innerHTML;
  const hasButton = document.querySelector(`.${translationButtonClassName}`)

  if (hasButton) return;

  if (text.length > 950) {
    const repeatCount = text.length % 950  === 0 ? parseInt(text.length / 950) : parseInt(text.length / 950) + 1;

    for (let i = 0; i < repeatCount; i++) {
      const slicedText = text.substr(0 + 950 * i, 950);
      const $button = createButton(slicedText);

      $el.append($button);
    }

    return;
  }

  const $button = createButton(text);

  $el.append($button);
};

const attachMutationObserver = () => {
  if (documentObserver) return;

  documentObserver = new MutationObserver(() => {
    const $novelHeader = document.querySelector(`#${novelHeaderId}`);
    const $translatedTextNode = document.querySelector(`#${papagoTranslatedWindowId}`);

    if ($novelHeader) {
      insertButton($novelHeader);
    }

    if ($translatedTextNode && !isTranslated) {
      changeAlpabetToAfterWord($translatedTextNode);
    }
  });

  documentObserver.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });
};

window.addEventListener("DOMContentLoaded", () => {
  attachMutationObserver();
});
