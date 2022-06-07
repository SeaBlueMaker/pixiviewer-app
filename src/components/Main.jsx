import React, { useRef, useState } from "react";

import VocabularyTab from "./VocabularyTab";

const accordionType = {
  translation: "translation",
};

export default function Main () {
  const [ isVocabularyOpened, setIsVocabularyOpened ] = useState(false);

  const vocabularyPanel = useRef();

  const controlPanel = (type) => {
    let panel;

    if (type === accordionType.vocabulary) {
      panel = vocabularyPanel;
    }

    if (panel.current.style.maxHeight) {
      panel.current.style.maxHeight = null;
    } else {
      panel.current.style.maxHeight = panel.current.scrollHeight + "px";
    }
  };

  const handleOnClick = (type) => {
    if (type === accordionType.vocabulary) {
      setIsVocabularyOpened(!isVocabularyOpened);
    }

    controlPanel(type);
  };

  return (
    <>
      <article>
        <button
          className={isVocabularyOpened ? "accordion accordion--active" : "accordion"}
          onClick={() => handleOnClick(accordionType.vocabulary)}
        >나만의 사전
        </button>
        <div className="accordion__panel" ref={vocabularyPanel}>
          <VocabularyTab panel={vocabularyPanel} />
        </div>
      </article>
    </>
  );
};
