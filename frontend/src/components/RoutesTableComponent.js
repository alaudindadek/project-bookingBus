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
    <div className="card-t bg-white rounded-lg shadow-md overflow-hidden">
      <div className="header-t px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">รายการเที่ยวรถ</h2>
      </div>
      <div className="list-t overflow-x-auto">
        <table className="table w-full">
          <thead className="h-table bg-gray-50">
            <tr>
              <th className="t-h-table px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                เที่ยวรถ
              </th>
              <th className="t-h-table px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                เส้นทาง
              </th>
              <th className="t-h-table px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                เวลา
              </th>
              <th className="t-h-table px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ราคา
              </th>
              <th className="t-h-table px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ที่นั่งว่าง
              </th>
              <th className="t-h-table px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                สถานะ
              </th>
              <th className="t-h-table px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="table-body bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="cell-t px-6 py-4 whitespace-nowrap">{route.code}</td>
                <td className="cell-t px-6 py-4 whitespace-nowrap">
                  {route.origin} → {route.destination}
                </td>
                <td className="cell-t px-6 py-4 whitespace-nowrap">
                  {route.departure_time} - {route.arrival_time}
                </td>
                <td className="cell-t px-6 py-4 whitespace-nowrap">{route.price} ฿</td>
                <td className="cell-t px-6 py-4 whitespace-nowrap">
                  {route.available_seats} / {route.total_seats}
                </td>
                <td className="cell-t px-6 py-4 whitespace-nowrap">
                  {route.available_seats > 0 ? "ว่าง" : "เต็ม"}
                </td>
                <td className="cell-t-i px-6 py-4 whitespace-nowrap">
                  <button className={`text-purple ${route.available_seats === 0 ? "disabled" : ""}`} title = "จองตั๋ว"
                    onClick={() => onBook(route)}
                  >
                    <i class="fas fa-ticket-alt"></i>
                  </button>
                  <button className="text-green text-purple-600 hover:text-purple-900" title="แก้ไข"
                    onClick={() => handleEdit(route)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="text-red ml-2 text-red-600 hover:text-red-900"
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
