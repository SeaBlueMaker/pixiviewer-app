import React, { useEffect, useState } from "react";

import TabMessage from "./TabMessage";
import VocabularyList from "./VocabularyList";
import InputBar from "./InputBar";

import { NO_VOCABULARY_DATA } from "../constants/messages"

export default function VocabularyTab ({ panel }) {
  const [ vocaList, setVocaList ] = useState([]);

  useEffect(() => {
    whale.storage.local.get("vocabularyList", (storage) => {
      if (!storage.vocabularyList) return;
      setVocaList(storage.vocabularyList);
    });
  }, []);

  const hasData = vocaList && vocaList.length !== 0;

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
