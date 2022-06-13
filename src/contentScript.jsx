const { default: alphabet } = require("./constants/alphabet");
const {
  CONTENT_SCRIPT,
  SIDEBAR,
} = require("./constants/messages");

const novelHeaderId = "gtm-novel-work-scroll-begin-reading";
const translationButtonClassName = "translation_button";
const papagoTranslatedWindowId = "txtTarget";

let document_observer = null;

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

    const requestTranslate = () => {
      const data = {
        from: CONTENT_SCRIPT,
        to: SIDEBAR,
        src: "vocabulary_list_request"
      };

      whale.runtime.sendMessage(data, (response) => {
        whale.storage.local.set({
          vocabularyList: response,
        });

        const numberedText = response.reduce(
          (previousValue, currentValue, index) => {
            const { before } = currentValue;
            const tempWord = alphabet[index] + alphabet[index];

            const replacedText = previousValue.replaceAll(before, tempWord);

            return replacedText;
          },
          spacedText
        );

        window.open(`https://papago.naver.com/?sk=auto&tk=ko&st=${numberedText}`, "_blank", "whale-sidebar");
      });
    };

    requestTranslate();
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

let isTranslated = false;
const attachMutationObserver = () => {
  if (document_observer) return;

  document_observer = new MutationObserver(() => {
    const $novelHeader = document.querySelector(`#${novelHeaderId}`);
    const $translatedTextNode = document.querySelector(`#${papagoTranslatedWindowId}`);

    if ($translatedTextNode && !isTranslated) {
      const translatedText = $translatedTextNode.innerHTML;

      setTimeout(() => {
        whale.storage.local.get("vocabularyList", (storage) => {
          const unNumberedText = storage.vocabularyList.reduce(
            (previousValue, currentValue, index) => {
              const { after } = currentValue;
              const tempWord = alphabet[index] + alphabet[index];

              const replacedText = previousValue.replaceAll(tempWord, after);

              return replacedText;
            },
            translatedText
          );

          $translatedTextNode.innerHTML = unNumberedText;
          isTranslated = true;
        });
      }, 2000);
    }

    if ($novelHeader) {
      insertButton($novelHeader);
    }
  });

  document_observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });
};

window.addEventListener("DOMContentLoaded", () => {
  attachMutationObserver();
});
