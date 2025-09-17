import React, { useEffect , useState} from "react";

function RouteModalCom({ onClose, onAddRoutes, editRoute, onUpdateRoutes }) {
  const [routesData, setRoutesData] = useState({
    code: "",
    origin: "",
    destination: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    total_seats: "",
    available_seats: "",
    status: "active",
  });

  useEffect(() => {
    if (editRoute) {
      setRoutesData(editRoute);
    }
  }, [editRoute]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoutesData((oldData) => ({ ...oldData, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let payload = { ...routesData };

    if (!editRoute) {
      // ถ้าเป็นการเพิ่มใหม่ → ให้ available_seats = total_seats
      payload.available_seats = payload.total_seats;
    } else {
      // ถ้าเป็นการแก้ไข → อัปเดต available_seats ตามส่วนต่าง
      const seatDiff = payload.total_seats - editRoute.total_seats;
      payload.available_seats = editRoute.available_seats + seatDiff;

      // กันค่า available_seats < 0
      if (payload.available_seats < 0) payload.available_seats = 0;
    }

    if (editRoute) {
      const res = await fetch(
        `http://localhost:8000/api/routes/${editRoute.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const updateRoutes = await res.json();
      if (onUpdateRoutes) onUpdateRoutes(updateRoutes);
      onClose();
    } else {
      const res = await fetch("http://localhost:8000/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const newRoutes = await res.json();
      if (onAddRoutes) onAddRoutes(newRoutes);
      onClose();
    }
  } catch (error) {
    console.error("Failed to save route:", error);
    alert("Failed to save route. Please try again.");
  }
};
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="text-lg">เพิ่มเที่ยวรถใหม่</h3>
        </div>
        <div className="modal-body">
          <div>
            <label className="label">รหัสเที่ยวรถ</label>
            <input
              type="text"
              name="code"
              value={routesData.code}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="modal-grid">
            <div>
              <label className="label">ต้นทาง</label>
              <input 
                type="text"
                name="origin"
                value="หาดใหญ่"
                className="input-field"
                readOnly
              />
              {/* <select
              name="origin"
                value={routesData.origin}
                onChange={handleChange}
                className="input-field"
                required   
              >
                <option value="">เลือกต้นทาง</option>
                <option value="หาดใหญ่">หาดใหญ่</option>
                <option value="กรุงเทพฯ">กรุงเทพฯ</option>
                <option value="ภูเก็ต">ภูเก็ต</option>
                <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
                <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
              </select> */}
            </div>

            <div>
              <label className="label">ปลายทาง</label>
              <select
                name="destination"
                value={routesData.destination}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">เลือกปลายทาง</option>
                {/* <option value="หาดใหญ่">หาดใหญ่</option> */}
                <option value="กรุงเทพฯ">กรุงเทพฯ</option>
                <option value="ภูเก็ต">ภูเก็ต</option>
                <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
                <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
              </select>
            </div>
          </div>

          <div className="modal-grid">
            <div>
              <label className="label">เวลาออก</label>
              <input
                type="time"
                name="departure_time"
                value={routesData.departure_time}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">เวลาถึง</label>
              <input
                type="time"
                name="arrival_time"
                value={routesData.arrival_time}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="modal-grid">
            <div>
              <label className="label">ราคา (บาท)</label>
              <input
                type="number"
                name="price"
                value={routesData.price}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">จำนวนที่นั่ง</label>
              <input
                type="number"
                name="total_seats"
                value={routesData.total_seats}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <input
            type="hidden"
            name="available_seats"
            value={routesData.available_seats || routesData.total_seats}
            readOnly
          />

          <div className="modal-footer">
            <button onClick={onClose} className="btn-cancel">
              ยกเลิก
            </button>
            <button onClick={handleSubmit} className="btn-save">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteModalCom;
