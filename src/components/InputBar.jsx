import React, { useState } from "react";

import { handleInputsChange } from "../utils/handleInputsChange";

export default function InputBar ({ vocaList, handleVocaListUpdate }) {
  const [ inputs, setInputs ] = useState({
    before: "",
    after: "",
  });

  const handleOnClick = async () => {
    const { before, after } = inputs;
    const newVocabulary = { before, after };
    const newList = [...vocaList];

    newList.push(newVocabulary);
    handleVocaListUpdate(newList);
    whale.storage.local.set({ vocabularyList: newList });

    setInputs({ before: "", after: ""});
  };

  return (
    <div className="input-bar">
      <input
        className="input--gray"
        type="text"
        name="before"
        id="before"
        placeholder="三途"
        onChange={(event) => handleInputsChange(event, inputs, setInputs)}
      />
      <label htmlFor="before"> 를 &#8594; </label>
      <input
        className="input--gray"
        type="text"
        name="after"
        id="after"
        placeholder="산즈"
        onChange={(event) => handleInputsChange(event, inputs, setInputs)}
      />
      <label htmlFor="after"> 로 해석합니다.</label>
      <button className="button--black" onClick={handleOnClick}>등록</button>
    </div>
  );
};
