import React, { useState } from "react";
import { Data } from "./data";

const appliedFilters = [];

export default function Filters() {
  const [data, setData] = useState(Data);
  const headers = [...new Set(Data.flatMap(obj => Object.keys(obj)))];
  const allKeys = new Set(Object.keys(Data[0]).filter(key => key !== 'id'));
  const [filterList, setFilterList] = useState(Array.from(allKeys));

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) appliedFilters.push({ [name]: value });
    else appliedFilters.splice(appliedFilters.findIndex(filter => filter[name] === value), 1);

    const filteredData = appliedFilters.length > 0
      ? Data.filter(item => appliedFilters.every(filter => appliedFilters.filter(f => Object.keys(f)[0] === name).some(f => f[name] === item[name]))) : Data;
    setData(filteredData);
  };

  const handleNameFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = value === "" ? Data : data.filter(x => x.name.toLowerCase().includes(value));
    setData(filteredData);
  };

  return (
    <div>
      <div className="filters-container">
        {filterList.map(filterName => {
          const uniqueValues = new Set();
          let inputRendered = false;
          if (filterName !== "id") {
            return (
              <div className="filter-group">
                <h3>{filterName.toUpperCase()}</h3>
                {Data.map(filterValues => {
                  if (!uniqueValues.has(filterValues[filterName])) {
                    uniqueValues.add(filterValues[filterName]);
                    return filterName && filterName.toLowerCase() !== "name"
                      ? (
                        <div className="form-check form-switch">
                          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{filterValues[filterName]}</label>
                          <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" name={filterName} value={filterValues[filterName]} onChange={handleFilterChange} />
                        </div>
                      ) : !inputRendered && (
                        <>
                          {inputRendered = true}
                          <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="Name" onChange={handleNameFilterChange} />
                          </div>
                        </>
                      );
                  } else return null;
                })}
              </div>
            );
          } else return null;
        })}
      </div>
      <table className="table table-striped">
        <thead>
          <tr>{headers.map(header => <th key={header}>{header.toUpperCase()}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header, i) => (
                row.hasOwnProperty(header)
                  ? <td key={i}>{row[header]}</td>
                  : <td key={i} colSpan={headers.length}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}