import React from 'react';
import { useState } from 'react';

function BookingModalCom({route , onClose , onAddBooking}) {
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [seatCount, setSeatCount] = useState(1);

    const handleBooking = async () => {
    if (!passengerName || !passengerPhone) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

  const phoneRegex = /^0\d{2}-\d{3}-\d{4}$/;
  if (!phoneRegex.test(passengerPhone)) {
    alert("กรุณากรอกเบอร์โทรในรูปแบบ 090-xxx-xxxx");
    return;
  }

    try {
      const res = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routeId: route.id,
          customerName: passengerName,
          seatCount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          `จองตั๋วสำเร็จ!\nเส้นทาง: ${route.origin} → ${route.destination}\nจำนวน: ${seatCount}\nรวม: ฿${data.total_price}`
        );

        if (onAddBooking) {
    onAddBooking(data);
  }

        onClose();
      } else {
        alert(data.message || "ไม่สามารถจองได้");
      }
    } catch (error) {
      console.error("Error booking:", error);
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="text-lg">จองตั๋ว</h3>
        </div>
        <div className="modal-body">
          <div className="detail-box">
            <div className="font-medium">{route.code}</div>
            <div>{route.origin} → {route.destination}</div>
            <div>เวลา: {route.departure_time} - {route.arrival_time}</div>
            <div>ราคา: ฿{route.price} / ที่นั่ง</div>
            <div>ที่นั่งว่าง: {route.available_seats}</div>
          </div>
          <div>
            <label className="ladel">ชื่อผู้โดยสาร</label>
            <input
              type="text"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              value={passengerPhone}
              onChange={(e) => setPassengerPhone(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block">จำนวนที่นั่ง</label>
            <input
              type="number"
              min="1"
              max={route.available_seats}
              value={seatCount}
              onChange={(e) => setSeatCount(parseInt(e.target.value))}
              className="input-field"
              required
            />
          </div>
          <div className="modal-footer">
            <button
              onClick={onClose}
              className="btn-cancel"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleBooking}
              className="btn-booking"
            >
              จองตั๋ว
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModalCom;
