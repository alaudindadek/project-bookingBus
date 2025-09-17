import React from "react";
import { useState } from "react";

function SearchCom({onSearch}) {

  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters); // ส่ง filters กลับ parent
    }
  };

  const handleReset = () => {
    const resetFilters = { origin: "", destination: "", date: "" };
    setFilters(resetFilters);
    if (onSearch) onSearch(resetFilters); // รีเซ็ตที่ parent ด้วย
  };
  return (
    <div className="card-s">
      <div className="grid-s">
        <div>
          <label className="block-s">
            ต้นทาง
          </label>
          <input 
                type="text"
                name="origin"
                value="หาดใหญ่"
                className="option-r"
                readOnly
              />
          {/* <select
            name="origin"
            value={filters.origin}
            onChange={handleChange}
            className="option-r"
          >
            <option value="">ทั้งหมด</option>
            <option value="หาดใหญ่">หาดใหญ่</option>
            <option value="กรุงเทพฯ">กรุงเทพฯ</option>
            <option value="ภูเก็ต">ภูเก็ต</option>
            <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
            <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
          </select> */}
        </div>
        <div>
          <label className="block-s">
            ปลายทาง
          </label>
          <select
            name="destination"
            value={filters.destination}
            onChange={handleChange}
            className="option-r"
          >
            <option value="">ทั้งหมด</option>
            {/* <option value="หาดใหญ่">หาดใหญ่</option> */}
            <option value="กรุงเทพฯ">กรุงเทพฯ</option>
            <option value="ภูเก็ต">ภูเก็ต</option>
            <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
            <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
          </select>
        </div>
        <div>
          <label className="blockT">วันที่</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="option-r"
          />
        </div>
        <div className="btn-s">
          <button
            onClick={handleSearch}
            className="btn-s-s"
          >
            ค้นหา
          </button>
          <button
            onClick={handleReset}
            className="btn-s-r"
          >
            รีเซ็ต
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchCom;
