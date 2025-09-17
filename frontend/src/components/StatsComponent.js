import React from "react";

function StatsCom({routes , booking}) {
  const totalRoutes = routes.length;

  const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

const todayBookings = booking.filter((b) => isToday(b.booking_date)).length;

const todayRevenue = booking
  .filter((b) => isToday(b.booking_date))
  .reduce((sum, b) => sum + parseFloat( b.total_price || 0), 0);

  const totalPassengers = booking.reduce(
    (sum, b) => sum + b.seat_count,
    0
  );
  return (
    <div className="grid-stats">
      <div className="card-stats">
        <div className="i">
          <div className="icon-r">
            <i className="Itext-r fas fa-route"></i>
          </div>
          <div className="ml">
              <p className="text">เส้นทางทั้งหมด</p>
              <p className="text-num" >
              {totalRoutes}
            </p>
            
          </div>
        </div>
      </div>
      <div className="card-stats">
        <div className="i">
          <div className="icon-b">
            <i className="Itext-b fas fa-ticket-alt"></i>
          </div>
          <div className="ml">
            <p className="text">การจองวันนี้</p>
            <p className="text-num">
              {todayBookings}
            </p>
          </div>
        </div>
      </div>
      <div className="card-stats">
        <div className="i">
          <div className="icon-p">
            <i className="Itext-p fas fa-users"></i>
          </div>
          <div className="ml">
            <p className="text">ผู้โดยสาร</p>
            <p className="text-num"
            >
              {totalPassengers}
            </p>
          </div>
        </div>
      </div>
      <div className="card-stats">
        <div className="i">
          <div className="icon-i">
            <i className="Itext-i fas fa-money-bill-wave"></i>
          </div>
          <div className="ml">
            <p className="text">รายได้วันนี้</p>
            <p className="text-num">
              ฿{todayRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCom;
