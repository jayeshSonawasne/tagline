import React, { useState } from "react";
import { Data } from "./data";
const appliedFilters = [];

export default function Filters() {
  const [data, setData] = useState(Data);
  const headers = Array.from(new Set(Data.flatMap(obj => Object.keys(obj))));
  const allKeys = new Set();
  Data.forEach(obj => Object.keys(obj).forEach(key => allKeys.add(key)));
  allKeys.delete('id');
  const allKeysArray = Array.from(allKeys);
  const [filterList, setFilterList] = useState(allKeysArray);

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      appliedFilters.push({ [name]: value });
    } else {
      const index = appliedFilters.findIndex((filter) => filter[name] === value);
      if (index !== -1) {
        appliedFilters.splice(index, 1);
      }
    }
    let filteredData;
    if (appliedFilters.length > 0) {
      filteredData = Data.filter((item) => {
        return appliedFilters.every((filter) => {
          const key = Object.keys(filter)[0];
          return appliedFilters
            .filter((f) => Object.keys(f)[0] === key)
            .some((f) => f[key] === item[key]);
        });
      });
    } else {
      filteredData = Data;
    }
    setData(filteredData);
  };

  const handleNameFilterChange = (e) => {
    let value = e.target.value.toLowerCase();
    if (value === "") {
      setData(Data);
    } else {
      let filteredData = data.filter(x => x.name.toLowerCase().includes(value));
      setData(filteredData);
    }
  };

  return (
    <div>
      <div className="filters-container">
        {filterList?.map((filterName) => {
          const uniqueValues = new Set();
          let inputRendered = false;
          if (filterName !== "id") {
            return (
              <div className="filter-group">
                <h3>{filterName.toUpperCase()}</h3>
                {Data?.map((filterValues) => {
                  if (!uniqueValues.has(filterValues[filterName])) {
                    uniqueValues.add(filterValues[filterName]);
                    if (filterName && filterName.toLowerCase() !== "name") {
                      if(filterValues[filterName]){
                        return (
                          <div className="form-check form-switch">
                            <label
                              className="form-check-label"
                              htmlFor="flexSwitchCheckDefault"
                            >
                              {filterValues[filterName]}
                            </label>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckDefault"
                              name={filterName}
                              value={filterValues[filterName]}
                              onChange={(e) => handleFilterChange(e)}
                            />
                          </div>
                        );
                      }
                    } else if (!inputRendered) {
                      inputRendered = true;
                      return (
                        <div class="input-group mb-3">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Name"
                            onChange={(e) => handleNameFilterChange(e)}
                          />
                        </div>
                      );
                    }
                  } else {
                    return null;
                  }
                })}
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            {headers?.map((headers) => (
              <th key={headers}>{headers.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index}>
              {headers.map((header, i) => {
                if (row.hasOwnProperty(header)) {
                  return <td key={i}>{row[header]}</td>;
                } else {
                  const colspan = headers.length;
                  return (
                    <td key={i} colSpan={colspan}></td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}