import React from "react";
import { useEffect, useState } from "react";

function RoutesTableCom({ routes , setRoutes , onEdit , onBook}) {

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือว่าต้องการลบเที่ยวรถนี้?")) 
      return;
    try {
      const res = await fetch(`http://localhost:8000/api/routes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      setRoutes(routes.filter((route) => route.id !== id));
    }catch (error) {
      console.error("Error deleting route:", error);
    }
  }

  const handleEdit = (route) => {
    if (onEdit) {
      onEdit(route);
    }
  }
  return (
    <div className="card-t">
      <div className="header-t">
        <h2>รายการเที่ยวรถ</h2>
      </div>
      <div className="list-t">
        <table className="table">
          <thead className="h-table">
            <tr>
              <th className="t-h-table">
                เที่ยวรถ
              </th>
              <th className="t-h-table">
                เส้นทาง
              </th>
              <th className="t-h-table">
                วันที่ 
              </th>
              <th className="t-h-table">
                เวลา
              </th>
              <th className="t-h-table">
                ราคา
              </th>
              <th className="t-h-table">
                ที่นั่งว่าง
              </th>
              <th className="t-h-table">
                สถานะ
              </th>
              <th className="t-h-table">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="cell-t">{route.code}</td>
                <td className="cell-t">
                  {route.origin} → {route.destination}
                </td>
                <td className="cell-t">
                  {route.route_date} 
                </td>
                <td className="cell-t">
                  {route.departure_time} น. - {route.arrival_time} น.
                </td>
                <td className="cell-t">{route.price} ฿</td>
                <td className="cell-t">
                  {route.available_seats} / {route.total_seats}
                </td>
                <td className="cell-t">
                  {route.available_seats > 0 ? "ว่าง" : "เต็ม"}
                </td>
                <td className="cell-t-i">
                  <button className={`text-purple ${route.available_seats === 0 ? "disabled" : ""}`} title = "จองตั๋ว"
                    onClick={() => onBook(route)}
                  >
                    <i class="fas fa-ticket-alt"></i>
                  </button>
                  <button className="text-green" title="แก้ไข"
                    onClick={() => handleEdit(route)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="text-red"
                    onClick={() => handleDelete(route.id)}
                    >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoutesTableCom;
