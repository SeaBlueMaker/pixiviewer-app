import React, { useEffect, useState } from "react";

import TabMessage from "./TabMessage";
import VocabularyList from "./VocabularyList";
import InputBar from "./InputBar";

import {
  CONTENT_SCRIPT,
  NO_VOCABULARY_DATA,
  SIDEBAR,
} from "../constants/messages"

export default function VocabularyTab ({ panel }) {
  const [ vocaList, setVocaList ] = useState([]);

  const vocabularyListData = JSON.parse(window.localStorage.getItem("pixiviewerVoca"));

  useEffect(() => {
    if (vocabularyListData) {
      setVocaList(vocabularyListData);
    }
  }, []);

  whale.runtime.onMessage.addListener(async (msg, sender, response) => {
    if (msg.from === CONTENT_SCRIPT && msg.to === SIDEBAR) {
      const vocabularyListData = JSON.parse(window.localStorage.getItem("pixiviewerVoca"));

      response(vocabularyListData);
    }
  });

  const hasData = vocabularyListData && vocabularyListData.length !== 0;

  return (
    <div className="tab--align">
      <section>
        <InputBar vocaList={vocaList} handleVocaListUpdate={setVocaList} />
      </section>
      <section className="content-box--margin">
        {hasData
          ? <VocabularyList
              panel={panel}
              data={vocaList}
              handleDataUpdate={setVocaList}
            />
          : <TabMessage text={NO_VOCABULARY_DATA} />
        }
      </section>
    </div>
  );
};
