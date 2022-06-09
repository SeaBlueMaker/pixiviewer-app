import React, { useState } from "react";

import PaginationBar from "./PaginationBar";

export default function VocabularyList ({ panel, data, handleDataUpdate }) {
  const [ limit, setLimit ] = useState(10);
  const [ currentPage, setCurrentPage ] = useState(1);

  const offset = (currentPage - 1) * limit;

  const handleOnChange = (event) => {
    setLimit(Number(event.target.value));
    panel.current.style.maxHeight = panel.current.scrollHeight + "rem";
  };

  const handleDeleteClick = async (word) => {
    const copied = [...data];
    const newList = copied.filter((voca) => voca.before !== word);

    handleDataUpdate(newList);

    window.localStorage.setItem("pixiviewerVoca", JSON.stringify(newList));
  };

  return (
    <>
      <label className="select__bar">
        <div className="select__title">개씩 보기</div>
        <select
          type="number"
          value={limit}
          onChange={handleOnChange}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
        </select>
      </label>
      <div className="column-box">
        {data.slice(offset, offset + limit).map((voca) => (
          <div className="column-box__elem" key={voca.before}>
            <button
              className="list__button--delete"
              onClick={() => handleDeleteClick(voca.before)}
            >
              &times;
            </button>
            <div className="list__title">{voca.before} &#8594; {voca.after}</div>
          </div>
        ))}
      </div>
      <footer>
        <PaginationBar
          total={data.length}
          limit={limit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </footer>
    </>
  );
};
