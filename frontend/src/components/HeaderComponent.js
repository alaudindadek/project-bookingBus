import React from 'react';


function HeaderCom({ onAddRoutes }) {
  return (
    <header className="gradient-bg">
      <div className="container">
        <div className="a">
          <div className="b">
            <i className="icon-bus fas fa-bus"></i>
            <h1 className="h-text">ระบบจัดการตั๋วรถทัวร์หาดใหญ่</h1>
          </div>
          <button
            onClick={onAddRoutes}
            className="btn-add"
          >
            <i className="fas fa-plus"></i> เพิ่มเที่ยวรถใหม่
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderCom;
