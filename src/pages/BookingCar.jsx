import { DefaultLayout } from "../components/DefaultLayout"
import { Link, useParams } from 'react-router-dom';
import { Col, Row, Divider, DatePicker, Checkbox, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import moment from "moment";



//import AOS from 'aos';

import 'aos/dist/aos.css'; 

const { RangePicker } = DatePicker;
function BookingCar() {
    const { carid } = useParams();
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setcar] = useState({});
  const dispatch = useDispatch();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    if (cars.length === 0) {
      dispatch(getAllCars());
      console.log(cars)
    } else {
      setcar(cars.find((o) => o._id === carid));
    }
  }, [cars, dispatch, carid]);

  useEffect(() => {
    setTotalAmount(totalHours * car.rentPerHour);
    if (driver) {
      setTotalAmount(totalAmount + 50 * totalHours);
    }
  }, [driver, totalHours,car.rentPerHour]);

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }
  


  function selectTimeSlots(values) {
    setFrom(moment(values[0]).format("MMM DD yyyy HH:mm"));
    setTo(moment(values[1]).format("MMM DD yyyy HH:mm"));

    setTotalHours(values[1].diff(values[0], "hours"));
  }

  async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

    const bookingData = {
      car : car._id,
      user : JSON.parse(localStorage.getItem('user')),
      bookedTimeSlots : {
          from : from ,
          to : to
      } ,
      totalHours : totalHours,
      totalAmount : totalAmount,
      driverRequired : driver
    }

    

    //http://localhost:2345/api/bookings/bookcar/${totalAmount}`

		const data = await fetch(`https://adrenturebackend.herokuapp.com/api/bookings/bookcar/${totalAmount}`, { method: 'POST',  headers: {'Content-Type': 'application/json'},body: JSON.stringify(bookingData) }).then((t) =>
			t.json()
		)

		//console.log(data)

		const options = {
			key:'rzp_test_2ESpxo186OswBB',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Donation',
			description: 'Thank you for nothing. Please give us some money',
			
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
    
	}

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row
        justify="center"
        className="d-flex align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Col lg={10} sm={24} xs={24} className='p-3'>
          <img src={car.image} alt="" className="carimg2 bs1 w-100" data-aos='flip-left' data-aos-duration='1500'/>
        </Col>

        <Col lg={10} sm={24} xs={24} className="text-right">
          <Divider type="horizontal" dashed>
            <h3 className="rph">Car Info</h3>
            
          </Divider>
          <div style={{ textAlign: "right" }}>
            <p className="rph">{car.name}</p>
            <p className="rph">{car.rentPerHour} Rent Per hour /-</p>
            <p className="rph">Fuel Type : {car.fuelType}</p>
            <p className="rph">Max Persons : {car.capacity}</p>
          </div>

          <Divider type="horizontal" dashed >
            <p className="rph">Select Time Slots</p>
            
          </Divider>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="MMM DD yyyy HH:mm"
            onChange={selectTimeSlots}
          />
          <br />
          <button
            className="btn1 mt-2 rph"
            onClick={() => {
              setShowModal(true);
            }}
          >
            See Booked Slots
          </button>
          {from && to && (
            <div>
              <p className="rph">
                Total Hours : <b className="rph">{totalHours}</b>
              </p>
              <p className="rph">
                Rent Per Hour : <b className="rph">{car.rentPerHour}</b>
              </p>
              <Checkbox 
                onChange={(e) => {
                  if (e.target.checked) {
                    setdriver(true);
                  } else {
                    setdriver(false);
                  }
                }}
              >
                <p className="rph">Driver Required</p>
                
              </Checkbox>

              <h3 className="rph">Total Amount : {totalAmount}</h3>

              <Link to={"/userbookings"}><button className="btn1"
                onClick={displayRazorpay}
              >Book Now</button></Link> 

              
            </div>
          )}
        </Col>

        {car.name && (
          <Modal
            visible={showModal}
            closable={false}
            footer={false}
            title="Booked time slots"
          >
            <div className="p-2">
              {car.bookedTimeSlots.map((slot) => {
                return (
                  <button className="btn1 mt-2">
                    {slot.from} - {slot.to}
                  </button>
                );
              })}

              <div className="text-right mt-5">
                <button
                  className="btn1"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </Modal>
        )}
      </Row>
    </DefaultLayout>
  );
}



export {BookingCar}