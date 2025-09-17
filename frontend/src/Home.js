import React from "react";
import HeaderCom from "./components/HeaderComponent";
import StatsCom from "./components/StatsComponent";
import SearchCom from "./components/SearchComponent";
import RoutesTableCom from "./components/RoutesTableComponent";
import RouteModalCom from "./components/RouteModalComponent";
import BookingModalCom from "./components/BookingModalComponent"
import { useEffect, useState } from "react";
import "./index.css";

function Home() {
  const [routes, setRoutes] = useState([]);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [allRoutes, setAllRoutes] = useState([]); // เก็บข้อมูลทั้งหมด
  const [editRoute, setEditRoute] = useState(null);

  const [isBookingModelOpen , setIsBookingModalOpen] = useState(false);
  const [selectedRoute , setSelectedRoute] = useState(null)

  const [booking , setBooking] = useState([])
  // fetch routes เมื่อ component โหลด
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/routes");
        const data = await res.json();
        setRoutes(data);
        setAllRoutes(data); // เก็บข้อมูลทั้งหมด
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoutes();
  }, []);

  useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/bookings");
      const data = await res.json();
      setBooking(data); // ตั้งค่า bookings จากฐานข้อมูล
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  fetchBookings();
}, []);

  // ฟังก์ชันเพิ่มการจอง
  const handleAddBooking = (newBooking) => {
  setBooking((prev) => [...prev, newBooking]);
};
  return (
    <div>
      <HeaderCom onAddRoutes={() => setIsRouteModalOpen(true)} />
      <main className="container mx-auto px-4 py-6">
        <StatsCom routes={routes} booking={booking}/>
        <SearchCom
          onSearch={(filters) => {
            const filtered = allRoutes.filter((route) => {
              return (
                (filters.origin === "" || route.origin === filters.origin) &&
                (filters.destination === "" ||
                  route.destination === filters.destination)
              );
            });
            setRoutes(filtered);
          }}
        />
        <RoutesTableCom 
            routes={routes} 
            setRoutes={setRoutes} 
            onEdit={(route) =>{ 
                setEditRoute(route)
                setIsRouteModalOpen(true)
            }}
            onBook={(route) => {
              setIsBookingModalOpen(true)
              setSelectedRoute(route)
            }}
            
        />
      </main>
      {isRouteModalOpen && (
        <RouteModalCom
          onClose={() => setIsRouteModalOpen(false)}
          onAddRoutes={(newRoute) => {
            setRoutes((prev) => [...prev, newRoute]);
            setAllRoutes((prev) => [...prev, newRoute]);
          }}
          editRoute = {editRoute}
          onUpdateRoutes = {(updateRoutes) => {
            setRoutes((prev) => 
                prev.map((route) => 
                    route.id === updateRoutes.id ? updateRoutes : route)
            )
            setAllRoutes((prev) => 
                prev.map((route) => 
                    route.id === updateRoutes.id ? updateRoutes : route)
            )
          }}
        />
      )}

      {isBookingModelOpen && selectedRoute && (
        <BookingModalCom 
          route={selectedRoute}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedRoute(null)
          }}
          onAddBooking={handleAddBooking}
        />
      )}
    </div>
  );
}

export default Home;
