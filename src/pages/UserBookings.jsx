import React, { useEffect } from "react";
import {DefaultLayout} from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../redux/actions/bookingActions";
import { Col, Row } from "antd";
import Spinner from '../components/Spinner';
import moment from "moment";
function UserBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookingsReducer);
  const {loading} = useSelector((state) => state.alertsReducer);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  return (
    <DefaultLayout>
        {loading && (<Spinner />)}
      <h3 className="text-center mt-2 rph">My Bookings</h3>
    
      <Row justify="center" gutter={16} >
        <Col lg={16} sm={24}>
         
            {bookings.filter(o=>o.user===user._id).map((booking) => {
             return <Row gutter={16} className="bs1 mt-3 text-left header" >
                <Col lg={6} sm={24} >
                    <p className="rph"><b className="rph">{booking.car.name}</b></p>
                    <p className="rph">Total hours : <b>{booking.totalHours}</b></p>
                    <p className="rph">Rent per hour : <b className="rph">{booking.car.rentPerHour}</b></p>
                    <p className="rph">Total amount : <b className="rph">{booking.totalAmount}</b></p>
                </Col>

                <Col lg={12} sm={24}>
                
                <p className="rph">From: <b className="rph">{booking.bookedTimeSlots.from}</b></p>
                <p className="rph">To: <b className="rph">{booking.bookedTimeSlots.to}</b></p>
                <p className="rph">Date of booking: <b className="rph">{moment(booking.createdAt).format('MMM DD yyyy')}</b></p>
                </Col>

                <Col lg={6} sm={24} className='text-right'>
                    <img style={{borderRadius:5}} alt = "" src={booking.car.image}  height="140" className="p-2"/>
                </Col>
              </Row>;
            })}
          
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export {UserBookings};